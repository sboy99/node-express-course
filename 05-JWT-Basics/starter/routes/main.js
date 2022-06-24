const express = require("express");
const router = express.Router();
const authorization = require("../middleware/auth");
const { login, dashboard } = require("../controllers/main");

router.route("/login").post(login);
router.route("/dashboard").get(authorization, dashboard);
module.exports = router;
