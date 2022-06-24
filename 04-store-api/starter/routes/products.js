const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");
//Routes..
// router.get("/", getAllProducts);
// router.post("/", createProduct);
// router.get("/:id", getSingleProduct);
// router.patch("/:id", updateProduct);
// router.delete("/:id", deleteProduct);

router.route("/").get(getAllProducts).post(createProduct);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

module.exports = router;
