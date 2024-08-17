const { model, Schema } = require("mongoose");
const gamesSchema = new Schema(
  {
    title: String,
    description: String,
    publisher: String,
    releaseDate: Date,
    platform: String,
    price: Number,
    discount: Number,
    quantity: Number,
    imageCover: String,
    images: [String],
    rating: {
      average: Number,
      count: Number,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

const Game = model("Games", gamesSchema);

module.exports = Game;
