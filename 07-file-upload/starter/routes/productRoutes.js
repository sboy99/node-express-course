const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
} = require("../controllers/productController");
const { uploadImage } = require("../controllers/uploadsController");
const { checkImage } = require("../middleware/check-image");

router.route("/").post(createProduct).get(getAllProducts);
router.route("/uploads").post([checkImage, uploadImage]);

module.exports = router;
