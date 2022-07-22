const err = require("../errors");
const { StatusCodes: sts } = require("http-status-codes");
const Products = require("../models/product");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// ! Create Product
const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Products.create(req.body);
  res.status(sts.CREATED).json({ product });
};

// ! Get All Products
const getAllProducts = async (req, res) => {
  const products = await Products.find({});
  res.status(sts.OK).json({ count: products.length, products });
};

// ! Get Single Product
const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Products.findOne({ _id: productId }).populate(
    "reviews"
  ); //This is a virtua populate method//
  if (!product)
    throw new err.NotFoundError(`No product found with id: ${productId}`);

  res.status(sts.OK).json({ product });
};

// ! Update Product
const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Products.findOneAndUpdate(
    { _id: productId, user: req.user.userId },
    { ...req.body },
    { new: true, runValidators: true }
  );
  if (!product)
    throw new err.NotFoundError(`No product found with id: ${productId}`);

  res.status(sts.OK).json({ product });
};

// ! Delete Product
const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Products.findOne({
    _id: productId,
    user: req.user.userId,
  });
  if (!product)
    throw new err.NotFoundError(`No product found with id: ${productId}`);

  await product.remove();
  res.status(sts.OK).json({ msg: `${product.name} deleted successfully!` });
};

// ! Upload Image
const uploadImage = async (req, res) => {
  if (!req.files) throw new err.BadRequestError(`No file uploaded`);
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image"))
    throw new err.BadRequestError(`Please select an image`);

  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize)
    throw new err.BadRequestError(`Image should not be larger than 1 mb`);

  // ? CloudNary SetUp ? //
  const filePath = productImage.tempFilePath;
  const { secure_url } = await cloudinary.uploader.upload(filePath, {
    // use_filename: true,
    folder: "e-commerce/productImage",
  });
  fs.unlinkSync(filePath);
  res.status(sts.OK).json({ image: secure_url });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
