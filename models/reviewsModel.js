const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    gameId: { type: Schema.Types.ObjectId, ref: "Games" },
    userId: { type: Schema.Types.ObjectId, ref: "Users" },
    rating: Number,
    comment: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Reviews", reviewSchema);
