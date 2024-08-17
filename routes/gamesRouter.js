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
const restrictTo = require("../middlewares/authorization.js");

router.use("/:gameId/reviews", reviewsRoutes);

router.get("/", getAllGames);
router.get("/:id", getGame);
router.post("/",restrictTo('admin'), createGame);
router.patch("/:id",updateGame)
router.delete("/:title",restrictTo('admin'), deleteGame);


module.exports = router;
