const Comment = require("../models/comment");
const Room = require("../models/room");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.create_comment_post = [
  body("commentBody", "Comment Body is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    let comment = new Comment({
      user: req.user._id,
      body: req.body.commentBody,
      createdAt: Date.now(),
    });

    if (!errors.isEmpty()) {
      const room = await Room.findById(req.params.id)
        .populate("user")
        .populate("tags")
        .populate({
          path: "comments",
          populate: { path: "user", model: "User" },
        })
        .exec();

      res.render("room", {
        room: room,
        errors: errors.array(),
      });
      return;
    }

    await comment.save();

    const room = await Room.findById(req.params.id).exec();
    room.comments.push(comment._id);

    const newRoom = new Room({
      user: room.user,
      title: room.title,
      description: room.description,
      tags: room.tags,
      comments: room.comments,
      createdAt: room.createdAt,
      updatedAt: Date.now(),
      _id: req.params.id,
    });

    await Room.findByIdAndUpdate(req.params.id, newRoom, {}).exec();

    res.redirect(`/rooms/${req.params.id}`);
  }),
];

exports.update_comment_post = [
  body("commentBody", "Comment Body is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    let comment = new Comment({
      user: req.user._id,
      body: req.body.commentBody,
      _id: req.params.commentId,
    });

    if (!errors.isEmpty()) {
      const room = await Room.findById(req.params.roomId)
        .populate("user")
        .populate("tags")
        .populate({
          path: "comments",
          populate: { path: "user", model: "User" },
        })
        .exec();

      res.render("room", {
        room: room,
        errors: errors.array(),
      });
      return;
    }

    await Comment.findByIdAndUpdate(req.params.commentId, comment, {}).exec();

    res.redirect(`/rooms/${req.params.roomId}`);
  }),
];

exports.delete_comment_post = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId).exec();
  const room = await Room.findById(req.params.roomId).exec();

  if (comment == null) {
    const err = new Error("Comment not found");
    err.status = 404;
    return next(err);
  }

  if (room == null) {
    const err = new Error("Room not found");
    err.status = 404;
    return next(err);
  }

  room.comments = room.comments.filter((comment) => {
    return comment != req.params.commentId;
  });

  const newRoom = new Room({
    user: room.user,
    title: room.title,
    description: room.description,
    tags: room.tags,
    comments: room.comments,
    createdAt: room.createdAt,
    updatedAt: Date.now(),
    _id: room._id,
  });

  await Room.findByIdAndUpdate(req.params.roomId, newRoom, {}).exec();

  await Comment.findByIdAndDelete(req.params.commentId).exec();

  res.redirect(`/rooms/${req.params.roomId}`);
});
