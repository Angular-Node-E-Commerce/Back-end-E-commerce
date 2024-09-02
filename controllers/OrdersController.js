const AppError = require("../utils/AppError");
const Order = require("./../models/ordersModel");
const axios = require("axios");

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

exports.getMyOrders = async (req, res, next) => {
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
  const newOrder = await Order.create({
    ...req.body,
    userId: req.user.id,
    orderStatus: "Pending",
  });
  res.status(201).json({
    status: "success",
    data: {
      order: newOrder,
      link: req.link,
    },
  });
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    if (!orders) {
      return next(new AppError("No orders found for this user", 404));
    }
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

exports.createPayment = async (req, res, next) => {
  const paymentData = {
    api_key: process.env.PAYMOB_API_KEY, // Replace with your Paymob API key
    delivery_needed: "false",
    amount_cents: `${+req.body.totalAmount * 100}`, // Amount in cents (10000 = 100 EGP)
    currency: "EGP",
    items: [],
    shipping_data: {
      first_name: req.user.profile.firstName,
      last_name: req.user.profile.lastName,
      email: req.user.email,
      street: req.body.street,
      city: req.body.city,
      country: req.body.country,
      phone_number: req.body.phoneNumber,
      building: req.body.building,
      floor: req.body.floor,
      apartment: req.body.apartment,
      postal_code: req.body.postalCode,
    },
  };

  try {
    // Step 1: Get Authentication Token
    const authResponse = await axios.post(
      "https://accept.paymobsolutions.com/api/auth/tokens",
      { api_key: paymentData.api_key }
    );
    const token = authResponse.data.token;

    // console.log("1", token);

    // Step 2: Create Order
    const orderResponse = await axios.post(
      "https://accept.paymobsolutions.com/api/ecommerce/orders",
      {
        auth_token: token,
        delivery_needed: paymentData.delivery_needed,
        amount_cents: paymentData.amount_cents,
        currency: paymentData.currency,
        items: [],
        shipping_data: paymentData.shipping_data,
      }
    );

    const orderId = orderResponse.data.id;
    // console.log("2", orderId);

    // Step 3: Generate Payment Key
    const paymentKeyRequest = {
      auth_token: token,
      amount_cents: paymentData.amount_cents,
      expiration: 3600,
      order_id: orderId,
      billing_data: paymentData.shipping_data,
      currency: paymentData.currency,
      integration_id: process.env.PAYMOB_INTEGRATION_ID,
    };

    const paymentKeyResponse = await axios.post(
      "https://accept.paymobsolutions.com/api/acceptance/payment_keys",
      paymentKeyRequest
    );
    // console.log("3", paymentKeyResponse.data);
    req.link = `https://accept.paymob.com/api/acceptance/iframes/862645?payment_token=${paymentKeyResponse.data.token}`;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
