const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, `Please Provide Name`],
    },
    price: {
      type: String,
      required: [true, `Please Provide Price`],
    },
    image: {
      type: String,
      required: [true, `Please Select Image`],
    },
  },
  { timestamps: true, validateBeforeSave: true }
);

module.exports = mongoose.model("Product", productSchema);
