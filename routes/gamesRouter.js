const express=require("express");
const router=express.Router();
const {getAllGames,createGame,getGame,deleteGame}= require('../controllers/gamesController.js')
//const auth = require('./../middlewares/auth.js');
//const restrictTo = require("../middlewares/authorization.js");
//const { uploadImages, handleImages } = require("../middlewares/images.js");


router.get("/games",getAllGames);
router.get("/games/:id",getGame);
router.post("/games",createGame);
router.delete("/games/:title",deleteGame);
// router.post("/",auth,restrictTo('user'),uploadImages('images',5),handleImages('images'),createPost);
// router.patch("/:title",upDatepost);
// router.delete("/:title",deletePost);

module.exports=router;