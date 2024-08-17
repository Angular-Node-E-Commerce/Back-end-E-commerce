const AppError = require("../utils/AppError");
const User = require("./../models/usersModel");

exports.getCart = async (req, res, next) => {
  const { cart } = await req.user.populate("cart.gameId");
  try {
    res.status(200).json({
      status: "success",
      cart,
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

exports.addItem = async (req, res) => {
  try {
    const { gameId } = req.params;
    const user = req.user;

    const cartIds = user.cart.map((item) => item.gameId._id.toString());
    if (!cartIds.includes(gameId)) {
      user.cart.push({ gameId, quantity: 1 });
      user.save();
      res.send({
        message: "Game added successfully",
        data: {
          cart: user.cart,
        },
      });
    } else {
      res.status(400).send({
        message: "item already in cart",
      });
    }
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

exports.removeItem = async (req, res) => {
  try {
    const { gameId } = req.params;
    const user = req.user;
    if (!user.cart.some((item) => item.gameId._id.toString() === gameId)) {
      return res.status(404).send({
        message: "Game not found in cart",
      });
    }
    const updatedCart = user.cart.filter(
      (item) => item.gameId._id.toString() !== gameId
    );
    user.cart = updatedCart;
    await user.save();
    res.status(204).send({
      message: "Game removed successfully",
      data: {
        cart: user.cart,
      },
    });
  } catch (err) {
    throw new AppError(err.message, 400);
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    if (!user.cart.some((item) => item.gameId._id.toString() === gameId)) {
      return res.status(404).send({
        message: "Game not found in cart",
      });
    }
    user.cart.forEach((item) => {
      if (item.gameId._id.toString() === gameId) {
        item.quantity = quantity;
      }
    });
    await user.save();
    res.status(200).send({
      message: "Quantity updated successfully",
      data: {
        cart: user.cart,
      },
    });
  } catch (err) {
    throw new AppError(err.message, 400);
  }
};

exports.clearCart = async (req, res) => {
  try {
    const user = req.user;
    user.cart = [];
    await user.save();
    res.status(204).send({
      message: "Cart cleared successfully",
      data: {
        cart: user.cart,
      },
    });
  } catch (err) {
    throw new AppError(err.message, 400);
  }
};
