const { model, Schema } = require("mongoose");
const crypto = require("crypto");

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
      select: false,
    },
    image: String,
    passwordConfirm:{
      type: String,
      select: false,
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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },

  {
    timestamps: true,
  }
);

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const user = model("User", userSchema);

module.exports = user;
