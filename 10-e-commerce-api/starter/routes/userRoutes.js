const express = require("express");
const router = express.Router();

// middlewares
const {
  authinticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

//Controllers
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  resetUserPassword,
} = require("../controllers/userController");

router
  .route("/")
  .get(authinticateUser, authorizePermissions("owner", "admin"), getAllUsers);
router.route("/showMe").get(authinticateUser, showCurrentUser);
router.route("/updateUser").patch(authinticateUser, updateUser);
router.route("/updateUserPassword").patch(authinticateUser, resetUserPassword);

// ! Note:
// Must include parametered router buttom of every route cuz if there is another route after '/' then express would pick that up as a parameter and will throw error
router.route("/:id").get(authinticateUser, getSingleUser);

module.exports = router;
