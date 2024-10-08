const Game = require("../models/gamesModel");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");
const APIFeatures = require("./../utils/APIFeatures");

exports.getAllGames = async (req, res, next) => {
  try {
    const games = await Game.find();
    res.send({ status: "success", length: games.length, data: { games } });
  } catch (err) {
    logger.error(`Error getting games: ${err.message}`);
    next(err);
  }
};
exports.getGame = async (req, res, next) => {
  try {
    const gameId = req.params.id;
    const game = await Game.findById(gameId);
    if (!game) {
      return next(new AppError("No game found with that ID", 404));
    }
    res.send({ status: "success", data: { game } });
  } catch (err) {
    logger.error(`Error getting game: ${err.message}`);
    next(err);
  }
};

exports.createGame = async (req, res, next) => {
  try {
    let imageCover;
    if (req.body.imageCover) imageCover = req.body.imageCover[0];
    const game = await Game.create({ ...req.body, imageCover });
    res.status(201).send({
      status: "success",
      message: "game created successfully",
      data: {
        game,
      },
    });
  } catch (err) {
    logger.error(`Error creating post: ${err.message}`);
    next(new AppError("Error creating post:", 400));
  }
};

exports.updateGame = async (req, res, next) => {
  try {
    const gameId = req.params.id;
    let imageCover;
    if (req.body.imageCover) imageCover = req.body.imageCover[0];
    const game = await Game.findByIdAndUpdate(
      { _id: gameId },
      { ...req.body, imageCover },
      { new: true, runValidators: true }
    );
    res.send({
      status: "success",
      message: "game updated successfully",
      data: { game },
    });
  } catch (err) {
    logger.error(`Error updating post: ${err.message}`);
    next(err);
  }
};

exports.deleteGame = async (req, res, next) => {
  try {
    await Game.deleteOne({ _id: req.params.id });
    res
      .status(204)
      .send({ status: "success", message: "game deleted successfully" });
  } catch (err) {
    logger.error(`Error deleting post: ${err.message}`);
    next(err);
  }
};
