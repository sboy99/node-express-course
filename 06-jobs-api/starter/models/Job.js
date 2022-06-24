require("dotenv").config();
const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, `Please Provide company Name`],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, `Please Provide company Name`],
      maxlength: 50,
    },
    status: {
      type: String,
      enum: [`Interview`, `declined`, "pending"],
      default: `pending`,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: `User`,
      required: [true, `Please Provide User`],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Jobs", JobSchema);
