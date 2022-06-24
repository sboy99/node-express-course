const customError = require("./custom-error");
const { StatusCodes: status } = require("http-status-codes");

class badRequest extends customError {
  constructor(msg) {
    super(msg, status.BAD_REQUEST);
  }
}
module.exports = badRequest;
