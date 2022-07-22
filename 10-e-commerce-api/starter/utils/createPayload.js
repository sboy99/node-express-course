const createPayload = (payload) => {
  return {
    name: payload.name,
    userId: payload._id,
    role: payload.role,
  };
};
module.exports = { createPayload };
