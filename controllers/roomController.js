const Room = require("../models/room");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.room_get = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED YET");
});

exports.create_room_get = asyncHandler(async (req, res) => {
  res.render("createroom");
});

exports.create_room_post = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED YET");
});

exports.update_room_get = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED YET");
});

exports.update_room_put = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED YET");
});

exports.delete_room_get = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED YET");
});

exports.delete_room_delete = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED YET");
});
