const userModel = require("../models/user");
const err = require("../errors");
const { StatusCodes: sts } = require("http-status-codes");
const {
  attachCookiesToResponse,
  createPayload,
  checkPermission,
} = require("../utils");

const getAllUsers = async (req, res) => {
  const allUsers = await userModel.find({ role: "user" }).select("-password");
  res.status(sts.OK).json({ total: allUsers.length, users: allUsers });
};

const getSingleUser = async (req, res) => {
  const { id: _id } = req.params;
  checkPermission(req.user, _id);
  const user = await userModel.findOne({ _id }).select("-password");
  if (!user) throw new err.NotFoundError(`User Not Found!`);
  res.status(sts.OK).json(user);
};

const showCurrentUser = async (req, res) => {
  res.status(sts.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;
  const toUpdate = {};
  if (!name && !email)
    throw new err.BadRequestError(`Please provide credentials!`);
  if (name) toUpdate.name = name.toLowerCase();
  if (email) toUpdate.email = email.toLowerCase();

  // Updating User..
  const newUser = await userModel
    .findOneAndUpdate({ _id: req.user.userId }, toUpdate, {
      new: true,
      runValidators: true,
    })
    .select("-password");
  const payload = createPayload(newUser);
  attachCookiesToResponse({ res, payload });
  res.status(sts.ACCEPTED).json({ user: payload });
};

const resetUserPassword = async (req, res) => {
  const { oldpassword, newpassword } = req.body;

  if (!oldpassword || !newpassword)
    throw new err.BadRequestError(`Please provide both passwords!`);

  if (oldpassword === newpassword)
    throw new err.BadRequestError(`Please provide unique password!`);
  // finding user
  const newUser = await userModel.findOne({ _id: req.user.userId });

  // Comparing password
  const isMatch = await newUser.comparePassword(oldpassword);
  if (!isMatch) throw new err.UnauthenticatedError(`Invalid Password!`);
  newUser.password = newpassword;
  await newUser.save();
  res.status(sts.OK).json({ msg: `Password updated successfully!` });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  resetUserPassword,
};
