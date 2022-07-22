require("dotenv").config();
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, `Please provide name`],
      minlength: [3, `Name should be atleast 3 letters long`],
      maxlength: [25, `Name should be atmost 25 letters long`],
    },
    email: {
      type: String,
      required: [true, `Please provide email`],
      validate: {
        validator: validator.isEmail,
        message: `Please provide a valid email address`,
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, `Please Provide a strong Password`],
      minlength: [6, `Password should be atleast 6 letters long`],
    },
    role: {
      type: String,
      enum: [`admin`, `user`],
      default: `user`,
    },
  },
  { timestamps: true, validateBeforeSave: true }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.email = this.email.toLowerCase();
  this.name = this.name.toLowerCase();
  next();
});

userSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("Users", userSchema);
