const { model, Schema } = require("mongoose");
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    cart: [
      {
        gameId: { type: Schema.Types.ObjectId, ref: "Games" },
        quantity: { type: Number, default: 1 },
      },
    ],
    role: String,
    profile: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      address: {
        country: String,
        city: String,
        street: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const user = model("User", userSchema);

module.exports = user;
