class customError extends Error {
  constructor(messege, status) {
    super(messege);
    this.status = status;
  }
}
const createCustomError = (msg, sts) => {
  return new customError(msg, sts);
};
module.exports = { createCustomError };
