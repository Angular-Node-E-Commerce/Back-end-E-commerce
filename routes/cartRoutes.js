const { Router } = require("express");
const {
  addItem,
  getCart,
  removeItem,
  updateQuantity,
  clearCart,
} = require("./../controllers/cartController");
const router = Router();
const auth = require("./../middlewares/authentication");

router.use(auth);

router.post("/:gameId", addItem);
router.get("/", getCart);
router.delete("/:gameId", removeItem);
router.patch("/:gameId", updateQuantity);
router.delete("/", clearCart);

module.exports = router;
