const User = require("../models/usersModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const logger = require("../utils/logger");
const Joi = require("joi");
const Email = require("../utils/email");
const AppError = require("../utils/AppError");
const crypto = require("crypto");

const jwtSign = promisify(jwt.sign);

const userSchema = Joi.object({
  username: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().alphanum().min(12),
  profile: {
    firstName: Joi.string(),
    lastName: Joi.string(),
    address: {
      country: Joi.string(),
      city: Joi.string(),
      street: Joi.string().alphanum(),
    },
  },
});

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).send({
      status: "success",
      length: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    logger.error(`Error getting users: ${err.message}`);
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    await userSchema.validateAsync(req.body);
    const { password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const existEmail = await User.findOne({ email });
    if (existEmail)
      return res
        .status(409)
        .send({ status: "fail", message: "email is already used" });

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
      role: "user",
    });
    const url = `${req.protocol}://${req.get("host")}/me`;
    await new Email(newUser, url).sendWelcome();

    res.send({
      status: "success",
      message: "user signed up successfully",
      data: {
        newUser,
      },
    });
  } catch (err) {
    logger.error(`Error during signup: ${err.message}`);
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res
        .status(404)
        .send({ status: "fail", message: "Invalid email or password" });

    const matched = await bcrypt.compare(password, user.password);
    if (matched) {
      const token = await jwtSign({ userId: user._id }, "secret", {
        expiresIn: "5d",
      });
      res.send({ message: "User logged in", token });
    } else {
      res
        .status(404)
        .send({ status: "fail", message: "Invalid email or password" });
    }
  } catch (err) {
    logger.error(`Error during login: ${err.message}`);
    next(err);
  }
};

// error i dont know it //////////////////////////////////////
exports.getCurrentUser = async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ status: "success", data: { currentUser } });
  } catch (err) {
    logger.error(`Error getting current user: ${err.message}`);
    next(err);
  }
};
exports.updateCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let { image } = req.body;
    image = image[0];
    console.log(image);
    const updatedUser = await User.findByIdAndUpdate(userId, {
      ...req.body,
      image,
    });
    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({
      message: "User updated successfully",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    logger.error(`Error updating user: ${err.message}`);
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.deleteOne();
    res.status(204).send({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (err) {
    logger.error(`Error deleting post: ${err.message}`);
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("there is no user with this email address", 404));
  }
  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/users/reset-password/${resetToken}`;
  await new Email(user, resetURL).sendPasswordreset();

  res.status(200).send({
    status: "success",
    message: "Token sent to email!",
  });
};

exports.resetPassword = async (req, res, next) => {
  try {
    // 1) Check if passwords match
    if (req.body.password !== req.body.passwordConfirm) {
      return next(new AppError("Passwords do not match", 400));
    }
    // 2) Get user based on the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    // 3) If token has not expired , and there is user , set the new password
    if (!user) {
      return next(new AppError("Token invalid or has expired", 400));
    }
    // 4) update changedPassswordAt property for the user
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password reset successful",
    });
  } catch (err) {
    logger.error(`Error resetting password: ${err.message}`);
    next(new AppError("There was a problem changing the Password", 400));
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { password, passwordConfirm, oldPassword } = req.body;

    if (password !== passwordConfirm) {
      return next(new AppError("Passwords do not match", 400));
    }

    const user = await User.findById(req.user._id).select("+password");

    const matched = await bcrypt.compare(oldPassword, user.password);
    if (!matched) {
      return next(new AppError("your current password is wrong.", 401));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (err) {
    logger.error(`Error updating password: ${err.message}`);
    next(new AppError("There was a problem updating the Password", 400));
  }
};
