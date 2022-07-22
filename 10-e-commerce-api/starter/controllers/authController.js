const userModel = require("../models/user");
const err = require("../errors");
const { StatusCodes: sts } = require("http-status-codes");
const { attachCookiesToResponse, createPayload } = require("../utils");

const register = async (req, res) => {
  // Checking if Email exist..
  const { name, email, password } = req.body;
  const isEmail = await userModel.findOne({ email });
  if (isEmail) throw new err.BadRequestError(`Email already in use!`);
  // Inserting to Database..
  const newUser = await userModel.create({ name, email, password });
  const payload = createPayload(newUser);

  attachCookiesToResponse({ res, payload });
  res.status(sts.CREATED).json({ user: payload });
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new err.BadRequestError(`Please provide email and password both`);

  // Search for user
  const newUser = await userModel.findOne({ email: email.toLowerCase() });
  if (!newUser) throw new err.NotFoundError(`User not found!`);

  //verifying password
  const isMatch = await newUser.comparePassword(password);
  if (!isMatch) throw new err.UnauthenticatedError(`Incorrect Password!`);

  const payload = createPayload(newUser);
  attachCookiesToResponse({ res, payload });
  res.status(sts.ACCEPTED).json({ user: payload });
};

// Logout
const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(sts.OK).json({ msg: `User Logged Out` });
};

module.exports = { register, login, logout };
