const express=require("express");
const router=express.Router();
const {getAllUsers,signup,login,getCurrentUser,updateCurrentUser}= require('../controllers/usersController');
const autho= require("../middlewares/authentication");



router.get("/users",getAllUsers);
router.get("/profile",autho,getCurrentUser);
router.post("/signup",signup);
router.post("/login",login);
router.patch("/profile",autho,updateCurrentUser);


module.exports=router;