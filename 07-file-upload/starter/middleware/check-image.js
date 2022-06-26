const Err = require("../errors");
const checkImage = async (req, res, next) => {
  try {
    if (!req.files) throw new Err.BadRequestError(`No file Uploaded`);
    const productImage = req.files.image;

    //not a image error
    if (!productImage.mimetype.startsWith("image"))
      throw new Err.BadRequestError(`Please Choose an image file`);

    //size limiter
    if (productImage.size > process.env.MAX_SIZE)
      throw new Err.BadRequestError(`Image size should be less than 1mb`);

    next();
  } catch (error) {
    throw new Err.BadRequestError(error);
  }
};

module.exports = { checkImage };
