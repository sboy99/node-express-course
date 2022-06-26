require("dotenv").config();
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const fs = require("fs");
const path = require("path");
const Err = require("../errors");
const cloudinary = require("cloudinary").v2;

//Uploads on server..
const uploadImageLocal = async (req, res) => {
  if (!req.files) throw new Err.BadRequestError(`No file Uploaded`);
  const productImage = req.files.image;

  //not a image error
  if (!productImage.mimetype.startsWith("image"))
    throw new Err.BadRequestError(`Please Choose an image file`);

  //size limiter
  if (productImage.size > process.env.MAX_SIZE)
    throw new Err.BadRequestError(`Image size should be less than 1mb`);

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(imagePath);

  return res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } });
};
// Uploads on another Cloud
const uploadImage = async (req, res) => {
  const filePath = req.files.image.tempFilePath;
  const { secure_url } = await cloudinary.uploader.upload(filePath, {
    use_filename: true,
    folder: "file-upload",
  });
  fs.unlinkSync(filePath);
  res.status(StatusCodes.CREATED).json({ image: { src: secure_url } });
};

module.exports = { uploadImage };
