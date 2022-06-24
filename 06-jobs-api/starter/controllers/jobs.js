const Job = require("../models/Job");
const Err = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getAllJobs = async (req, res) => {
  //We are not accessing not all the jobs present in server but created by a specific User.
  const Jobs = await Job.find({ createdBy: req.user.id });
  res.status(StatusCodes.OK).json({ Total: Jobs.length, Jobs });
};

const getJob = async (req, res) => {
  //Destructuring with req to userId n jobId using alias
  const {
    user: { id: UserId },
    params: { id: JobId },
  } = req;
  //Checking for job, is associated with userId or not.
  const job = await Job.findOne({ _id: JobId, createdBy: UserId });
  if (!job) throw new Err.NOT_FOUND(`Not found any job with id:${JobId}`);
  res.status(StatusCodes.OK).json(job);
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.id;
  const job = await Job.create({ ...req.body });
  res.status(StatusCodes.CREATED).json(job);
};

const updateJob = async (req, res) => {
  //Destructruing
  const {
    body: { company, position },
    user: { id: UserId },
    params: { id: JobId },
  } = req;

  if (!company || !position)
    throw new Err.BAD_REQUEST(`Company and Position is required! `);

  const job = await Job.findOneAndUpdate(
    { _id: JobId, createdBy: UserId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) throw new Err.NOT_FOUND(`Not found any job with id:${JobId}`);

  res.status(StatusCodes.OK).json(job);
};

const deleteJob = async (req, res) => {
  //Destructuring with req to userId n jobId using alias
  const {
    user: { id: UserId },
    params: { id: JobId },
  } = req;
  //Deleting job, is associated with userId or not.
  const job = await Job.deleteOne({ _id: JobId, createdBy: UserId });
  if (job.deletedCount === 0)
    throw new Err.NOT_FOUND(`Not found any job with id:${JobId}`);
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
