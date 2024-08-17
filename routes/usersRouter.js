const express=require("express");
const router=express.Router();
const {getAllUsers,signup,login,getCurrentUser,updateCurrentUser}= require('../controllers/usersController');
const autho= require("../middlewares/authentication");
const restrictTo = require("../middlewares/authorization");



router.get("/users",restrictTo('admin'),getAllUsers);
router.get("/users/me",autho,getCurrentUser);
router.post("/signup",signup);
router.post("/login",login);
router.patch("/users/me",autho,updateCurrentUser);


module.exports=router;