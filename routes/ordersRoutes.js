const { Router } = require("express");
const {
  getAllOrders,
  getAllOrdersForUser,
  createOrder,
} = require("./../controllers/OrdersController");
const auth = require("./../middlewares/authentication");

const router = Router();

router.get("/", getAllOrders);
router.get("/my-orders", auth, getAllOrdersForUser);
router.post("/", auth, createOrder);

module.exports = router;
