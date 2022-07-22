const err = require("../errors");
const { isTokenValid } = require("../utils");

const authinticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) throw new err.UnauthenticatedError(`Authintication Failed!`);

  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };
  } catch (error) {
    throw new err.UnauthenticatedError(`Authintication Failed!`);
  }

  next();
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw new err.AccessForbidden(`Permission Denied!`);
    next();
  };
};

module.exports = { authinticateUser, authorizePermissions };
