const err = require("../errors");

const checkPermission = (reqUser, paramId) => {
  if (reqUser.role === "admin") return;
  if (reqUser.userId === paramId.toString()) return;
  throw new err.AccessForbidden(`Permission Denied`);
};

module.exports = { checkPermission };
