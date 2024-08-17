const AppError = require("../utils/AppError");
const User = require("./../models/usersModel");

exports.getCart = async (req, res, next) => {
  console.log(req.user.id);
  const userr = await User.findById(req.user.id).populate("cart.gameId");
  try {
    res.status(200).json({
      status: "success",
      cart: userr.cart,
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

exports.addItem = async (req, res) => {
  try {
    const { gameId } = req.params;
    const user = req.user;

    const cartIds = user.cart.map((item) => item._id.toString());
    if (!cartIds.includes(gameId)) {
      user.cart.push(gameId);
    }
    user.save();
    res.send({
      message: "Game added successfully",
      data: {
        cart: user.cart,
      },
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

exports.removeItem = async (req, res) => {
  console.log(req.params);
  res.send("bla bla ");
};

exports.updateQuantity = async (req, res) => {
  console.log(req.body);
  res.send("bla bla ");
};

exports.clearCart = async (req, res) => {
  console.log(req.user);
  res.send("bla bla ");
};
