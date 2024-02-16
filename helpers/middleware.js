const ObjectId = require("mongoose").Types.ObjectId;

exports.setCurrentUser = (req, res, next) => {
  res.locals.currentUser = req.user;
  next();
};

exports.checkIdFormat = () => {
  return (req, res, next) => {
    if (ObjectId.isValid(req.params.id) && !req.params._id) {
      return next();
    }

    if (ObjectId.isValid(req.params.id) && ObjectId.isValid(req.params._id)) {
      return next();
    }

    const err = new Error("Invalid ID");
    err.status = 400;
    err.message = "Invalid ID";
    return next(err);
  };
};

// Redirects to login if authenticated.
exports.checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

// Redirects to home if not authenticated.
exports.checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
};
