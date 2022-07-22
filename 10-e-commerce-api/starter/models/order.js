const mongoose = require("mongoose");

const singleOrderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  product: { type: mongoose.Types.ObjectId, ref: "Products", required: true },
});

const orderSchema = new mongoose.Schema(
  {
    tax: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: {
      type: [singleOrderItemSchema],
    },
    status: {
      type: String,
      enum: ["pending", "failed", "paid", "delivered", "cancled", "shipped"],
      default: "pending",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentIntendId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", orderSchema);
