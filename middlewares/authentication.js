const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");
const AppError = require("./../utils/AppError");
const jwtVerify = promisify(jwt.verify);

module.exports = async (req, res, next) => {
  try {
    const { authorization: token } = req.headers;
    const { userId } = await jwtVerify(token, "secret");
    if (!userId) {
      throw new AppError("Not authorized, token is invalid", 401);
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    req.user = user;
    next();
  } catch (err) {
    throw new AppError("Not authorized, token is invalid", 401);
  }
};
