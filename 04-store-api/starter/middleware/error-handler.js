const errorHandlerMiddleware = async (err, req, res, next) => {
  return res.status(err?.status ?? 500).json({ msg: err.message });
};

module.exports = errorHandlerMiddleware;
