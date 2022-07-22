const express = require("express");
const router = express.Router();

const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewContoller");
const {
  authinticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
router.route("/").get(getAllReviews).post(authinticateUser, createReview);

router
  .route("/:id")
  .get(getSingleReview)
  .patch(authinticateUser, updateReview)
  .delete(authinticateUser, deleteReview);

module.exports = router;
