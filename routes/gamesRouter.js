const express = require("express");
const router = express.Router();
const {
  getAllGames,
  createGame,
  getGame,
  updateGame,
  deleteGame,
} = require("../controllers/gamesController.js");
const reviewsRoutes = require("./reviewsRoutes.js");
const auth = require("./../middlewares/authentication.js");
const restrictTo = require("../middlewares/authorization.js");
const { handleImages, uploadImages } = require("../middlewares/images.js");

router.use("/:gameId/reviews", reviewsRoutes);

router.get("/", getAllGames);
router.get("/:id", getGame);
router.post(
  "/",
  auth,
  restrictTo("admin"),
  uploadImages([
    { name: "images", count: 5 },
    { name: "imageCover", count: 1 },
  ]),
  handleImages("imageCover"),
  handleImages("images"),
  createGame
);
router.patch(
  "/:id",
  auth,
  restrictTo("admin"),
  uploadImages([
    { name: "images", count: 5 },
    { name: "imageCover", count: 1 },
  ]),
  handleImages("imageCover"),
  handleImages("images"),
  updateGame
);
router.delete("/:id", auth, restrictTo("admin"), deleteGame);

module.exports = router;
