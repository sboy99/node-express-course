const mongoose = require("mongoose");
const { deleteCloudinanyImage } = require("../utils");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, `Please provide a name`],
      maxlength: [100, `Name can not be more than 100 characters`],
    },
    price: {
      type: Number,
      required: [true, `Please provide price`],
      default: 0,
      min: [0, `Can't accept a negetive price`],
    },
    description: {
      type: String,
      required: [true, `Please provide some information`],
      maxlength: [1000, `Name can not be more than 1000 characters`],
    },
    image: {
      type: String,
      default: "/uploads/default.jpeg",
    },
    category: {
      type: String,
      required: [true, `Please provide product Category`],
      enum: ["office", "kitchen", "bedroom", "fashion", "electronics"],
    },
    company: {
      type: String,
      enum: {
        values: ["marcos", "liddy", "ikea", "others"],
        message: `Please select a vaild Company Name`,
      },
    },
    colors: {
      type: [String],
      required: true,
      default: ["#222"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: [true, `Please provide stock size`],
      default: 10,
      min: [1, `Minimum stock size is 1`],
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    noOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  {
    timestamps: true,
    validateBeforeSave: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("reviews", {
  ref: "Reviews",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

productSchema.pre("remove", async function (next) {
  await deleteCloudinanyImage(this.image);
  await this.model("Reviews").deleteMany({ product: this._id });
  next();
});

module.exports = mongoose.model("Products", productSchema);
