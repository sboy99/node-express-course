const err = require("../errors");
const { StatusCodes: sts } = require("http-status-codes");
const Reviews = require("../models/review");
const Products = require("../models/product");
const { checkPermission } = require("../utils");

//!Create Review!//
const createReview = async (req, res) => {
  const { product: productId } = req.body;

  const isValidProduct = await Products.findOne({ _id: productId });
  if (!isValidProduct) throw new err.NotFoundError(`It is not a valid Product`);

  const isAlreadyReviewed = await Reviews.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (isAlreadyReviewed)
    throw new err.BadRequestError(`Review Already Written`);

  req.body.user = req.user.userId;
  const review = await Reviews.create(req.body);
  res.status(sts.CREATED).json({ review });
};

//!Get All Reviews!// [Populate]
const getAllReviews = async (req, res) => {
  const reviews = await Reviews.find({}).populate({
    path: "product",
    select: "name price company",
  });
  res.status(sts.OK).json({ count: reviews.length, reviews });
};

//!Get Single Product!//
const getSingleReview = async (req, res) => {
  const { id: _id } = req.params;
  const review = await Reviews.findOne({ _id });
  if (!review) throw new err.NotFoundError(`Review not found with id: ${_id}`);
  res.status(sts.OK).json({ review });
};

//!Update Review!//
const updateReview = async (req, res) => {
  const { id: _id } = req.params;
  const review = await Reviews.findOne({ _id });
  if (!review) throw new err.NotFoundError(`Review not found with id: ${_id}`);
  checkPermission(req.user, review.user);
  const { rating, title, comment } = req.body;
  if (rating) review.rating = rating;
  if (title) review.title = title;
  if (comment) review.comment = comment;
  await review.save();
  res.status(sts.OK).json({ review });
};

//!Delete Review!//
const deleteReview = async (req, res) => {
  const { id: _id } = req.params;
  const review = await Reviews.findOne({ _id });
  if (!review) throw new err.NotFoundError(`Review not found with id: ${_id}`);
  checkPermission(req.user, review.user);
  await review.remove();
  res.status(sts.OK).json({ msg: `Review deleted successfully` });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
