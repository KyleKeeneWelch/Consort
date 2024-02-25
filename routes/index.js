const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const roomController = require("../controllers/roomController");
const tagController = require("../controllers/tagController");
const commentController = require("../controllers/commentController");

const {
  checkIdFormat,
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../helpers/middleware");

// Dashboard
router.get("/", checkAuthenticated, userController.index_get);

// Login
router.get("/login", checkNotAuthenticated, userController.login_get);

router.post("/login", checkNotAuthenticated, userController.login_post);

// Logout
router.get("/logout", checkAuthenticated, userController.logout_get);

// Register
router.get("/register", checkNotAuthenticated, userController.register_get);

router.post("/register", checkNotAuthenticated, userController.register_post);

// Edit Account
router.get(
  "/users/:id/update",
  checkAuthenticated,
  checkIdFormat(),
  userController.update_user_get
);

router.post(
  "/users/:id/update",
  checkAuthenticated,
  checkIdFormat(),
  userController.update_user_post
);

// Room
router.get("/rooms/create", checkAuthenticated, roomController.create_room_get);

router.post(
  "/rooms/create",
  checkAuthenticated,
  roomController.create_room_post
);

router.get(
  "/rooms/:id/update",
  checkAuthenticated,
  checkIdFormat(),
  roomController.update_room_get
);

router.post(
  "/rooms/:id/update",
  checkAuthenticated,
  checkIdFormat(),
  roomController.update_room_post
);

router.post(
  "/rooms/:id/delete",
  checkAuthenticated,
  checkIdFormat(),
  roomController.delete_room_post
);

router.get(
  "/rooms/:id",
  checkAuthenticated,
  checkIdFormat(),
  roomController.room_get
);

// Tag

router.get(
  "/tags/:id/delete",
  checkAuthenticated,
  checkIdFormat(),
  tagController.delete_tag_get
);

// Comment

router.post(
  "/rooms/:id/comments/create",
  checkAuthenticated,
  checkIdFormat(),
  commentController.create_comment_post
);

router.post(
  "/rooms/:roomId/comments/:commentId/update",
  checkAuthenticated,
  checkIdFormat(),
  commentController.update_comment_post
);

router.post(
  "/rooms/:roomId/comments/:commentId/delete",
  checkAuthenticated,
  checkIdFormat(),
  commentController.delete_comment_post
);

module.exports = router;
