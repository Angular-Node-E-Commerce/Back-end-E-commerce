const { Schema, model } = require("mongoose");

const categoriesSchema = new Schema(
  {
    name: String,
    description: String,
    catImage: String,
  },
  {
    timestamps: true,
  }
);

const Category = model("Category", categoriesSchema);

module.exports = Category;
