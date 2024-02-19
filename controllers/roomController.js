const Room = require("../models/room");
const Tag = require("../models/tag");
const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const ObjectId = require("mongoose").Types.ObjectId;

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

exports.create_room_get = asyncHandler(async (req, res) => {
  const tags = await Tag.find().exec();
  res.render("createRoom", { title: "Create Room", tags: tags });
});

exports.create_room_post = [
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
      createdAt: Date.now(),
    });

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
      room.save();
      res.redirect(`/rooms/${room._id}`);
    }
  }),
];

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
      await Room.findByIdAndUpdate(req.params.id, room, {});
      res.redirect(`/rooms/${room._id}`);
    }
  }),
];

exports.delete_room_post = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id).exec();

  if (room == null) {
    const err = new Error("Room not found");
    err.status = 404;
    return next(err);
  }

  const commentsToDel = [];

  room.comments.forEach((comment) => {
    const promise = new Promise(async (resolve, reject) => {
      await Comment.findByIdAndDelete(comment).exec();
      resolve();
    });
    commentsToDel.push(promise);
  });

  await Promise.all(commentsToDel);

  await Room.findByIdAndDelete(req.params.id).exec();

  res.redirect("/");
});
