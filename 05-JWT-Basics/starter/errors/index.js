const badRequest = require("./badRequest");
const unauthorized = require("./unauthorized");
const customError = require("./custom-error");

const ERR = {
  BAD_REQUEST: badRequest,
  UNAUTHORIZED: unauthorized,
  CUSTOM_ERR: customError,
};

module.exports = ERR;
