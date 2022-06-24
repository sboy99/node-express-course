const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, `Product Name Required`],
    minlength: [3, `Product name have to be atleast 3 letters long`],
    maxlength: [25, `Product name is to long`],
  },
  price: {
    type: Number,
    trim: true,
    required: [true, `Price is Required`],
    min: [0, `Price can't be negetive`],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0.0,
    min: [0.0, `Rating must be positive`],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    enum: ["ikea", "liddy", "caressa", "marcos"],
  },
});

module.exports = mongoose.model("Products", ProductsSchema);
