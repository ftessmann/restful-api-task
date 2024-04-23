const express = require("express");
const router = express.Router();

const UserController = require("../controllers/users-control");

const checkAuth = require("../middleware/check-auth");

// create user route
router.post("/signup", UserController.user_create);

// create user login route
router.post("/login", UserController.user_login);

// delete user route
router.delete("/:userId", checkAuth, UserController.user_delete);

module.exports = router;