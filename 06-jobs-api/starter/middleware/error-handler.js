const CustomAPIError = require("../errors/custom-api");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || `Something went wrong. Please try again later!`,
  };

  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  // Duplicate Error
  if (err.code && err.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.message = `Duplicate Value of ${Object.keys(
      err.keyValue
    )}.Please provide unique`;
  }
  //Validation Error..
  if (err.name === "ValidationError") {
    defaultError.message = Object.values(err.errors)
      .map((mongoErr) => mongoErr.message)
      .join(",");
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
  }
  //Cast Error..
  if ((err.name = "CastError")) {
    defaultError.statusCode = StatusCodes.NOT_FOUND;
    defaultError.message = `Not found any job with id:${err?.value}`;
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res
    .status(defaultError.statusCode)
    .json({ message: defaultError.message });
};

module.exports = errorHandlerMiddleware;
