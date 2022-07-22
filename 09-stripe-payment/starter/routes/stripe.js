const express = require("express");
const { stripePayment } = require("../controllers/stripeController");
const router = express.Router();

router.route("/").post(stripePayment);

module.exports = router;
