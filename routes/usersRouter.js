const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  signup,
  login,
  getCurrentUser,
  updateCurrentUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/usersController");
const auth = require("../middlewares/authentication");
const restrictTo = require("../middlewares/authorization");

router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

router.get("/", auth, restrictTo("admin"), getAllUsers);
router.get("/me", auth, getCurrentUser);
router.post("/signup", signup);
router.post("/login", login);
router.patch("/me", auth, updateCurrentUser);
router.delete("/:id", auth, restrictTo("role"), deleteUser);
router.patch("/update-password", auth, updatePassword);

module.exports = router;
