const ERR = require("../errors");
const jwt = require("jsonwebtoken");

const authorizationMiddleware = (req, res, next) => {
  const authHeader = req.headers?.authorization;
  if (!authHeader) throw new ERR.UNAUTHORIZED("Unauthorized! ");
  const token = authHeader.split(" ")[1];
  if (token === "null") throw new ERR.UNAUTHORIZED("Unauthorized!");
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.authorizedData = data;
    next();
  } catch (error) {
    throw new ERR.UNAUTHORIZED("Token Validation Failed! ");
  }
};

module.exports = authorizationMiddleware;
