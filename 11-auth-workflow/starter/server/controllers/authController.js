const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils");
const crypto = require("crypto");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const Token = require("../models/Token");
const sendResetPasswordEmail = require("../utils/sendResetPasswordEmail");
const register = async (req, res) => {
  const { email, name, password } = req.body;
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";
  const verificationToken = crypto.randomBytes(40).toString("hex");
  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });
  const origin = `http://localhost:3000`;
  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });
  res.status(StatusCodes.CREATED).json({
    msg: "Successfully Created! Please check your email",
    verificationToken,
  });
};

//Login//
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  const { isVerified } = user;

  if (!isVerified) {
    throw new CustomError.UnauthenticatedError(`Verify Password`);
  }

  const tokenUser = createTokenUser(user);
  //* Refresh Token *//
  let refreshToken = "";
  //Check For Existing//
  const isRefreshTokenAvailable = await Token.findOne({ user: user._id });
  if (isRefreshTokenAvailable) {
    const { isValid } = isRefreshTokenAvailable;
    if (!isValid)
      throw new CustomError.UnauthenticatedError("Permission Denied");
    refreshToken = isRefreshTokenAvailable.refreshToken;
  } else {
    //Create New refresh token//
    refreshToken = crypto.randomBytes(40).toString("hex");
    const userAgent = req.headers["user-agent"];
    const ip = req.ip;
    const userToken = { refreshToken, userAgent, ip, user: user._id };
    await Token.create(userToken);
  }
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

//Logout//
const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId });
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

//verifyEmail//
const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new CustomError.NotFoundError(`User Not Found`);
  if (user.verificationToken !== verificationToken)
    throw new CustomError.UnauthenticatedError(`Invalid Token`);
  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";
  await user.save();

  res.status(StatusCodes.OK).json({ user });
};

//Forgot Password//
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email)
    throw new CustomError.BadRequestError("Please Provide an valid email");

  const user = await User.findOne({ email });
  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");
    const tenMiniutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMiniutes);

    user.passwordToken = passwordToken;
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();

    //Send Reset Password Email//
    const origin = `http://localhost:3000`;
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      passwordToken,
      origin,
    });
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your email for forget password link!" });
};

//Reset Password //
const resetPassword = async (req, res) => {
  const { password, token, email } = req.body;
  if (!password || !token || !email)
    throw new CustomError.BadRequestError(`Please Provide all details`);
  const user = await User.findOne({ email });
  if (user) {
    if (
      token === user.passwordToken &&
      user.passwordTokenExpirationDate > new Date()
    ) {
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      user.password = password;
      await user.save();
    } else throw new CustomError.BadRequestError(`session experied`);
  }
  res
    .status(StatusCodes.ACCEPTED)
    .json({ msg: `Password Updated Successfully` });
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
