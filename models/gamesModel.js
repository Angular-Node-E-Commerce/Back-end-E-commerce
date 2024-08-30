const { model, Schema } = require("mongoose");
const gamesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      index: true, // This will create a default index
    },
    description: {
      type: String,
      required: true,
      index: true, // This will create a default index
    },
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
gamesSchema.index({ title: "text", description: "text" });

const Game = model("Games", gamesSchema);

module.exports = Game;
