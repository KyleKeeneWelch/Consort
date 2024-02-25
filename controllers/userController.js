const User = require("../models/user");
const Room = require("../models/room");
const Tag = require("../models/tag");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt = require("bcrypt");

exports.index_get = asyncHandler(async (req, res) => {
  let rooms = await Room.find().populate("user").populate("tags").exec();
  const tags = await Tag.find().exec();
  let searchValue = "";

  if (req.query.search) {
    searchValue = req.query.search;
    const query = new RegExp(req.query.search, "i");
    let isTagMatch = false;

    rooms = rooms.filter((room) => {
      room.tags.forEach((tag) => {
        if (tag.title.match(query)) {
          return (isTagMatch = true);
        }
      });

      if (room.title.match(query) || isTagMatch) {
        isTagMatch = false;
        return true;
      }
      return false;
    });
  }
  res.render("dashboard", {
    rooms: rooms,
    searchValue: searchValue,
    tags: tags,
  });
});

exports.login_get = (req, res) => {
  res.render("login");
};

exports.login_post = [
  body("email", "Email is required")
    .trim()
    .isLength({ min: 1 })
    .isEmail()
    .withMessage("Invalid email format")
    .escape(),
  body("password", "Password is required with a minimum of 8 characters")
    .trim()
    .isLength({ min: 8 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("login", {
        email: req.body.email,
        errors: errors.array(),
      });
      return;
    } else {
      next();
    }
  },
  (req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true,
    })(req, res, next);
  },
];

exports.logout_get = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
};

exports.register_get = (req, res) => {
  res.render("register", { title: "Register" });
};

exports.register_post = [
  body("first_name", "First Name is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("last_name", "Last Name is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "Username is required").trim().isLength({ min: 1 }).escape(),
  body("email", "Email is required")
    .trim()
    .isLength({ min: 1 })
    .isEmail()
    .withMessage("Invalid email format")
    .escape(),
  body("password", "Password is required with a minimum of 8 characters")
    .trim()
    .isLength({ min: 8 })
    .escape(),
  body("confirm_password", "Confirm Password is required")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Confirm Password needs to match Password"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      createdAt: Date.now(),
    });

    if (!errors.isEmpty()) {
      res.render("register", {
        title: "Register",
        user: user,
        errors: errors.array(),
      });
      return;
    }

    const existingUser = await User.findOne({ email: req.body.email }).exec();

    if (existingUser) {
      res.render("register", {
        title: "Register",
        user: user,
        errors: [{ msg: "User with email already exists" }],
      });
      return;
    }

    await user.save();

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/"); // Redirect to the homepage or any desired route after login
    });
  }),
];

exports.update_user_get = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select({ password: 0 })
    .exec();

  if (user === null) {
    const err = new Error("No User Found");
    err.status = 404;
    return next(err);
  }

  res.render("register", { title: "Edit Account", user: user });
});

exports.update_user_post = [
  body("first_name", "First Name is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("last_name", "Last Name is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "Username is required").trim().isLength({ min: 1 }).escape(),
  body("email", "Email is required")
    .trim()
    .isLength({ min: 1 })
    .isEmail()
    .withMessage("Invalid email format")
    .escape(),
  body("password", "Password is required with a minimum of 8 characters")
    .trim()
    .isLength({ min: 8 })
    .escape(),
  body("confirm_password", "Confirm Password is required")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Confirm Password needs to match Password"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    if (!errors.isEmpty()) {
      res.render("register", {
        user: user,
        errors: errors.array(),
        title: "Edit Account",
      });
      return;
    }

    const existingUser = await User.findById(req.params.id);

    if (!existingUser) {
      res.render("register", {
        user: user,
        errors: [{ msg: "User doesn't exist" }],
      });
      return;
    }

    user._id = req.params.id;
    await User.findByIdAndUpdate(req.params.id, user, {});
    res.redirect("/");
  }),
];
