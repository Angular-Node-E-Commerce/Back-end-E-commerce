
const {promisify}=require('util');
const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");

const jwtVerify = promisify(jwt.verify);


module.exports=async(req,res,next)=>{
    const { authorization: token } = req.headers;

    const {userId} =await jwtVerify(token,"secret");
    const user = await User.findById(userId);
    req.user=user;
    next();
}