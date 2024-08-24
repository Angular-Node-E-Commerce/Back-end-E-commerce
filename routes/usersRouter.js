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
const { handleImages, uploadImages } = require("./../middlewares/images");

router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

router.get("/", auth, restrictTo("admin"), getAllUsers);
router.get("/me", auth, getCurrentUser);
router.post(
  "/signup",
  uploadImages([{ name: "image", count: 1 }]),
  handleImages("image"),
  signup
);
router.post("/login", login);
router.patch(
  "/me",
  auth,
  uploadImages([{ name: "image", count: 1 }]),
  handleImages("image"),
  updateCurrentUser
);
router.delete("/:id", auth, restrictTo("admin"), deleteUser);
router.patch("/update-password", auth, updatePassword);

module.exports = router;
