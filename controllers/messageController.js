const Message = require("../models/message");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.create_message_post = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED YET");
});

exports.update_message_put = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED YET");
});

exports.delete_message_delete = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED YET");
});
