const { Schema, model } = require("mongoose");

const categoriesSchema = new Schema(
  {
    name: String,
    description: String,
    image: String,
  },
  {
    timestamps: true,
  }
);

const Category = model("Category", categoriesSchema);

module.exports = Category;
