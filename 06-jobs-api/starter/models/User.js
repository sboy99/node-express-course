require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide Name"],
    minlength: [3, `Atleast 3 letters long Name is required`],
    maxlength: [50, `Name should be less than 10 letters`],
    unique: false,
  },
  email: {
    type: String,
    required: [true, "Please Provide Email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please Provide Valid Email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Provide Password"],
    minlength: 3,
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.getToken = function () {
  return jwt.sign({ id: this._id, name: this.name }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

userSchema.methods.checkPassword = async function (userPass) {
  const isMatch = await bcrypt.compare(userPass, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", userSchema);
