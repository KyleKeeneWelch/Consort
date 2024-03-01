const Room = require("../models/room");
const Tag = require("../models/tag");
const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const ObjectId = require("mongoose").Types.ObjectId;

// Get Room
exports.room_get = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id)
    .populate("user")
    .populate("tags")
    .populate({ path: "comments", populate: { path: "user", model: "User" } })
    .exec();

  if (room == null) {
    const err = new Error("Room does not exist");
    err.status = 404;
    return next(err);
  }

  res.render("room", { room: room });
});

// Get Create Room
exports.create_room_get = asyncHandler(async (req, res) => {
  const tags = await Tag.find().exec();
  res.render("createRoom", { title: "Create Room", tags: tags });
});

// Create a Room
exports.create_room_post = [
  body("title", "Title is required").trim().isLength({ min: 1 }).escape(),
  body("description", "Description is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("tags.*", "Tags are required").trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    // Revised meaning new tag(s) need to be added
    let isRevisedRoom = false;

    let room = new Room({
      user: req.user._id,
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      comments: [],
      createdAt: Date.now(),
    });

    // Passes as a string if singular so need to check for array and then length
    if (Array.isArray(req.body.tags) && req.body.tags.length > 3) {
      res.render("createRoom", {
        title: "Create Room",
        room: room,
        errors: [{ msg: "A Room can have up to 3 tags" }],
      });
      return;
    }

    if (req.body.tags == null) {
      const err = new Error(
        "Tags are required. Ensure a tag checkbox is selected before submit"
      );
      err.status = 400;
      next(err);
      return;
    }

    if (!errors.isEmpty()) {
      res.render("createRoom", {
        title: "Create Room",
        room: room,
        errors: errors.array(),
      });
      return;
    }

    // Check if new tags have been passed, push to array and set as revised room. Singular new tag isn't array so requires separate statement.
    let newTags = [];
    if (Array.isArray(req.body.tags)) {
      req.body.tags.forEach((tag) => {
        if (!ObjectId.isValid(tag)) {
          newTags.push(tag);
          isRevisedRoom = true;
        }
      });
    } else {
      if (!ObjectId.isValid(req.body.tags)) {
        newTags.push(req.body.tags);
        isRevisedRoom = true;
      }
    }

    // Creates the new tags and assigns the req.body.tags with the created tag IDs then creates the room.
    if (isRevisedRoom) {
      let createTags = [];

      newTags.forEach((tag) => {
        createTags.push(
          new Promise((resolve, reject) => {
            const newTag = new Tag({
              user: req.user,
              title: tag,
              createdAt: Date.now(),
            });
            newTag.save();
            if (Array.isArray(req.body.tags)) {
              const index = req.body.tags.indexOf(tag);
              req.body.tags[index] = newTag._id;
            } else {
              req.body.tags = newTag._id;
            }
            resolve();
          })
        );
      });

      Promise.all(createTags).then(() => {
        room.tags = req.body.tags;
        room.save();
        res.redirect(`/rooms/${room._id}`);
      });
    } else {
      // Just create
      room.save();
      res.redirect(`/rooms/${room._id}`);
    }
  }),
];

// Get Update Room
exports.update_room_get = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id).populate("tags").exec();

  if (room == null) {
    const err = new Error("Room Not Found");
    err.status = 404;
    next(err);
    return;
  }
  if (req.user._id.toString() != room.user.toString()) {
    const err = new Error("Not Room Owner");
    err.status = 403;
    next(err);
    return;
  }

  const tags = await Tag.find().exec();

  res.render("createRoom", { title: "Update Room", tags: tags, room: room });
});

// Update Room
exports.update_room_post = [
  body("title", "Title is required").trim().isLength({ min: 1 }).escape(),
  body("description", "Description is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("tags.*", "Tags are required").trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    let isRevisedRoom = false;

    let room = new Room({
      user: req.user._id,
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      comments: [],
      _id: req.params.id,
    });

    // Passes as a string if singular so need to check for array and then length
    if (Array.isArray(req.body.tags) && req.body.tags.length > 3) {
      const _room = await Room.findById(req.params.id).populate("tags").exec();
      res.render("createRoom", {
        title: "Update Room",
        room: _room,
        errors: [{ msg: "A Room can have up to 3 tags" }],
      });
      return;
    }

    if (req.body.tags == null) {
      const err = new Error(
        "Tags are required. Ensure a tag checkbox is selected before submit"
      );
      err.status = 400;
      next(err);
      return;
    }

    if (!errors.isEmpty()) {
      const _room = await Room.findById(req.params.id).populate("tags").exec();
      res.render("createRoom", {
        title: "Update Room",
        room: _room,
        errors: errors.array(),
      });
      return;
    }

    // Check if new tags have been passed, push to array and set as revised room. Singular new tag isn't array so requires separate statement.
    let newTags = [];
    if (Array.isArray(req.body.tags)) {
      req.body.tags.forEach((tag) => {
        if (!ObjectId.isValid(tag)) {
          newTags.push(tag);
          isRevisedRoom = true;
        }
      });
    } else {
      if (!ObjectId.isValid(req.body.tags)) {
        newTags.push(req.body.tags);
        isRevisedRoom = true;
      }
    }

    // Creates the new tags and assigns the req.body.tags with the created tag IDs then updates the room.
    if (isRevisedRoom) {
      let createTags = [];

      newTags.forEach((tag) => {
        createTags.push(
          new Promise((resolve, reject) => {
            const newTag = new Tag({
              user: req.user,
              title: tag,
              createdAt: Date.now(),
            });
            newTag.save();
            if (Array.isArray(req.body.tags)) {
              const index = req.body.tags.indexOf(tag);
              req.body.tags[index] = newTag._id;
            } else {
              req.body.tags = newTag._id;
            }
            resolve();
          })
        );
      });

      Promise.all(createTags).then(async () => {
        room.tags = req.body.tags;
        await Room.findByIdAndUpdate(req.params.id, room, {});
        res.redirect(`/rooms/${room._id}`);
      });
    } else {
      // Just update room
      await Room.findByIdAndUpdate(req.params.id, room, {});
      res.redirect(`/rooms/${room._id}`);
    }
  }),
];

// Delete Room
exports.delete_room_post = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id).exec();

  if (room == null) {
    const err = new Error("Room not found");
    err.status = 404;
    return next(err);
  }

  const commentsToDel = [];
  // Obtains and deletes each comment in room.
  room.comments.forEach((comment) => {
    const promise = new Promise(async (resolve, reject) => {
      await Comment.findByIdAndDelete(comment).exec();
      resolve();
    });
    commentsToDel.push(promise);
  });

  await Promise.all(commentsToDel);

  // Deletes room
  await Room.findByIdAndDelete(req.params.id).exec();

  res.redirect("/");
});
