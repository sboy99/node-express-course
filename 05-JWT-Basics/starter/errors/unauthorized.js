const customError = require("./custom-error");
const { StatusCodes: status } = require("http-status-codes");

class unauthorized extends customError {
  constructor(msg) {
    super(msg, status.UNAUTHORIZED);
  }
}
module.exports = unauthorized;
