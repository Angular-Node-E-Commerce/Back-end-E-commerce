const { model, Schema } = require("mongoose");
const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users" }, // Reference to Users
    items: [
      {
        gameId: { type: Schema.Types.ObjectId, ref: "Games" }, // Reference to Games
        quantity: Number,
        priceAtPurchase: Number, // To account for price changes
      },
    ],
    totalAmount: Number,
    orderStatus: { type: String, enum: ["Pending", "Completed", "Cancelled"] }, // e.g., 'Pending', 'Completed', 'Cancelled'
  },
  {
    timestamps: true,
  }
);
const Order = model("Order", OrderSchema);

module.exports = Order;
