const express = require("express");
const router = express.Router();
const {
  getAllGames,
  createGame,
  getGame,
  deleteGame,
} = require("../controllers/gamesController.js");
const reviewsRoutes = require("./reviewsRoutes.js");

router.use("/:gameId/reviews", reviewsRoutes);

router.get("/", getAllGames);
router.get("/:id", getGame);
router.post("/", createGame);
router.delete("/:title", deleteGame);

module.exports = router;
