const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, `Please give some rating`],
    },
    title: {
      type: String,
      trim: true,
      required: [true, `Please provide a title`],
      maxlength: [150, `title is too big`],
    },
    comment: {
      type: String,
      trim: true,
      required: [true, `Please comment something`],
      maxlength: [1000, `Maximum length reached`],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    product: { type: mongoose.Types.ObjectId, ref: "Products" },
  },
  { timestamps: true, validateBeforeSave: true }
);

//>Regulating user to write review once per product<//
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

reviewSchema.statics.calcAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        noOfReviews: { $sum: 1 },
      },
    },
  ]);

  await this.model("Products").findOneAndUpdate(
    { _id: productId },
    {
      averageRating: result[0]?.averageRating.toFixed(1) || 0,
      noOfReviews: result[0]?.noOfReviews,
    }
  );
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRating(this.product);
  console.log(`Product Saved`);
});
reviewSchema.post("remove", async function () {
  await this.constructor.calcAverageRating(this.product);
  console.log(`Product Removed`);
});

module.exports = mongoose.model("Reviews", reviewSchema);
