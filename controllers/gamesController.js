const Game =require("../models/gamesModel");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");



exports.getAllGames = async (req, res, next) => {
    try {
        const games = await Game.find();
        res.send(games);
    } catch (err) {
        logger.error(`Error getting games: ${err.message}`);
        next(err);
    }
};
exports.getGame=async (req, res, next) => {
    try {
        const gameId=req.params.id;
        const game = await Game.findById(gameId);
        res.send(game);
    } catch (err) {
        logger.error(`Error getting game: ${err.message}`);
        next(err);
    }
};

exports.createGame = async (req, res, next) => {
    try {
        let { title, description,publisher,releaseDate,platform,price,discount,quantity,imageCover,images,rating,category } = req.body;
        imageCover= imageCover[0];
        const game = new Game({ title, description,publisher,releaseDate,platform,price,discount,quantity,imageCover,images,rating,category});
        console.log(images,imageCover);
        await game.save();
        res.send({ msg: "game created", game });
    } catch (err) {
        logger.error(`Error creating post: ${err.message}`);
        next(new AppError('Error creating post:',400));
    }
};

exports.updateGame = async (req, res, next) => {
    try {
        const gameId=req.params.id;
        await Game.findByIdAndUpdate({ _id: gameId }, req.body);
        res.send("Update done");
    } catch (err) {
        logger.error(`Error updating post: ${err.message}`);
        next(err);
    }
};

exports.deleteGame = async (req, res, next) => {
    try {

        await Game.deleteOne();
        res.send("Deleted done");
    } catch (err) {
        logger.error(`Error deleting post: ${err.message}`);
        next(err);
    }
};