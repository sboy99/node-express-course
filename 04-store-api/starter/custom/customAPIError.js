class customAPIError extends Error {
  constructor(msg, sts) {
    super(msg);
    this.status = sts;
  }
}
const throwError = (msg, sts) => {
  return new customAPIError(msg, sts);
};
module.exports = throwError;
