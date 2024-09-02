const { Router } = require("express");
const {
  getAllOrders,
  getMyOrders,
  createOrder,
  getUserOrders,
  createPayment,
} = require("./../controllers/OrdersController");
const auth = require("./../middlewares/authentication");
const restrictTo = require("../middlewares/authorization.js");

const router = Router();

router.get("/", auth, restrictTo("admin"), getAllOrders);
router.get("/me", auth, restrictTo("user"), getMyOrders);
router.get("/:userId", auth, restrictTo("admin"), getUserOrders);
router.post("/", auth, restrictTo("user"), createPayment, createOrder);

module.exports = router;
