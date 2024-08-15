const AppError = require("../utils/AppError");
const Order = require("./../models/ordersModel");

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(200).json({
      status: "success",
      data: {
        orders,
      },
    });
  } catch (err) {
    next(new AppError("Error retrieving orders", 500));
  }
};

exports.getAllOrdersForUser = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    // const orders = await Order.find({ userId: req.params.id });
    res.status(200).json({
      status: "success",
      data: {
        orders,
      },
    });
  } catch (err) {
    next(new AppError("Error retrieving orders for this user", 500));
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    // const newOrder = await Order.create({ ...req.body, userId: req.user.id });
    const newOrder = await Order.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        order: newOrder,
      },
    });
  } catch (err) {
    next(new AppError("Error creating order", 500));
  }
};

// exports.updateOrderStatus = async (req, res, next) => {
//     try {
//       const order = await Order.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         { new: true, runValidators: true }
//       );
//       if (!order) {
//         return next(new AppError("Order not found", 404));
//       }
//       res.status(200).json({
//         status: "success",
//         data: {
//           order,
//         },
//       });
//     } catch (err) {
//       next(new AppError("Error updating order status", 500));
//     }
// };
