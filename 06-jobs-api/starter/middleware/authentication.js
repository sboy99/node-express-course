require("dotenv").config();
const jwt = require("jsonwebtoken");
const Err = require("../errors");
const User = require("../models/User");

const auth = (req, res, next) => {
  // Check Header
  const authHeader = req.headers?.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    throw new Err.UNAUTHORIZED(`Authentication Error!`);
  // Spiliting String and getting token...
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_KEY);
    //Attach User to job routes..
    req.user = { id: payload.id, name: payload.name };
    next();
  } catch (error) {
    throw new Err.UNAUTHORIZED(`Access Denied!`);
  }
};

module.exports = auth;
