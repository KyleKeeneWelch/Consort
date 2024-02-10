const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const roomController = require("../controllers/roomController");
const tagController = require("../controllers/tagController");
const messageController = require("../controllers/messageController");

// Dashboard
router.get("/", userController.index_get);

router.post("/", userController.index_post);

// Login
router.get("/login", userController.login_get);

router.post("/login", userController.login_post);

// Register
router.get("/register", userController.register_get);

router.post("/register", userController.register_post);

// Edit Account
router.get("/users/:id/update", userController.update_user_get);

router.put("/users/:id/update", userController.update_user_put);

// Room
router.get("/rooms/create", roomController.create_room_get);

router.post("/rooms/create", roomController.create_room_post);

router.get("/rooms/:id/update", roomController.update_room_get);

router.put("/rooms/:id/update", roomController.update_room_put);

router.get("/rooms/:id/delete", roomController.delete_room_get);

router.delete("/rooms/:id/delete", roomController.delete_room_delete);

router.get("/rooms/:id", roomController.room_get);

// Tag

router.delete("/tags/:id/delete", tagController.delete_tag_delete);

// Message

router.post(
  "/rooms/:id/messages/create",
  messageController.create_message_post
);

router.put(
  "/rooms/:id/messages/:id/update",
  messageController.update_message_put
);

router.delete(
  "/rooms/:id/messages/:id/delete",
  messageController.delete_message_delete
);

// MIDDLEWARE TO CHECK IF/IF NOT AUTHENTICATED
// function checkAuthenticated(req, res, next) {

// }

// function checkNotAuthenticated(req, res, next) {

// }

module.exports = router;
