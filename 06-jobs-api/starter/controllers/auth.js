const User = require("../models/User");
const Err = require("../errors");
const { StatusCodes: sts } = require("http-status-codes");

/**
 *  * Register Method !
 *  ! What I have leared?..
 *  -  Create a User using mongoose model
 *  -  Insert req.body data to database
 *  -  Before that use mongoose pre method for schema for encrypting user password.
 *  -  Create a salt using bcryptjs package
 *  -  Hash User Password and save the password to database
 *  -  Create an Authintication function using schema Instance of mongoose
 *  -  Now just Create a user usin req.body data call getToken(for mycase) function send respose to clint with token.
 *  -  You can send token along with a header or just with json.
 */

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.getToken();
  res.status(sts.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new Err.BAD_REQUEST(`Please Provide Email and Password`);
  // Find User exist or not
  const user = await User.findOne({ email });
  if (!user) throw new Err.UNAUTHORIZED(`No user found!`);
  // Checking Password
  const isValid = await user.checkPassword(password);
  if (!isValid) throw new Err.UNAUTHORIZED(`Invalid Password`);
  //Generating Token if all above is correct
  const token = user.getToken();
  res.status(sts.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
