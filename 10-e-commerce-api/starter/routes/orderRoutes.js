const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  getCurrentUserOrders,
  getSingleOrder,
  updateOrder,
  creatOrder,
} = require("../controllers/orderController");
const {
  authinticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .get(authinticateUser, authorizePermissions("admin"), getAllOrders)
  .post(authinticateUser, creatOrder);
router.route("/showAllMyOrders").get(authinticateUser, getCurrentUserOrders);
router
  .route("/:id")
  .get(authinticateUser, getSingleOrder)
  .patch(authinticateUser, updateOrder);

module.exports = router;
