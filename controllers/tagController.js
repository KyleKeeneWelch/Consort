const Tag = require("../models/tag");
const Room = require("../models/room");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const ObjectId = require("mongoose").Types.ObjectId;

// Delete tag
exports.delete_tag_get = asyncHandler(async (req, res, next) => {
  const tagsInRooms = await Room.find({ tags: req.params.id }).exec();

  // Can't delete if tag exists in a room.
  if (tagsInRooms.length > 0) {
    const err = new Error(
      "Tag is part of at least 1 room. Unselect the tag in room(s) before deleting"
    );
    err.status = 403;
    next(err);
    return;
  }

  // Delete tag
  await Tag.findByIdAndDelete(req.params.id).exec();

  // Redirect to previous location
  if (req.query.page == "CreateRoom") {
    res.redirect("/rooms/create");
  } else if (req.query.page == "UpdateRoom") {
    req.query.roomId
      ? res.redirect(`/rooms/${req.query.roomId}/update`)
      : res.redirect("/");
  } else {
    res.redirect("/");
  }
});
