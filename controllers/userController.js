const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt = require("bcrypt");

exports.index_get = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED YET");
});

exports.index_post = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED YET");
});

exports.login_get = asyncHandler(async (req, res) => {
  res.render("login");
});

exports.login_post = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED YET");
});

exports.register_get = asyncHandler(async (req, res) => {
  res.render("register");
});

exports.register_post = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED YET");
});

exports.update_user_get = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED YET");
});

exports.update_user_put = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED YET");
});
