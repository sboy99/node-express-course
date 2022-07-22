const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  uploadImage,
  deleteProduct,
} = require("../controllers/productController");
const {
  authinticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .get(getAllProducts)
  .post(authinticateUser, authorizePermissions("admin"), createProduct);
router
  .route("/uploadimage")
  .post(authinticateUser, authorizePermissions("admin"), uploadImage);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authinticateUser, authorizePermissions("admin"), updateProduct)
  .delete(authinticateUser, authorizePermissions("admin"), deleteProduct);

module.exports = router;
