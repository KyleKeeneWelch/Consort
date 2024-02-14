const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.create_comment_post = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED YET");
});

exports.update_comment_post = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED YET");
});

exports.delete_comment_post = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED YET");
});
