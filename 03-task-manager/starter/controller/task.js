//Calling DB model..
const Task = require("../models/task");
const { asyncWrapper } = require("../middleware/asyncWrapper");
const { createCustomError } = require("../custom/customError");

const readAllTask = asyncWrapper(async (req, res) => {
  const tasks = await Task.find({});
  res.status(200).send(tasks);
});

const createTask = asyncWrapper(async (req, res) => {
  const task = await Task.create(req.body);
  res.status(200).json(task);
});

const readTask = asyncWrapper(async (req, res, next) => {
  const task = await Task.findOne({ _id: req.params.id });
  if (!task) return next(createCustomError("File Not Found", 404));
  res.status(200).send(task);
});

const updateTask = asyncWrapper(async (req, res, next) => {
  const { id: taskId } = req.params;
  const task = await Task.findOneAndUpdate({ _id: taskId }, req.body, {
    new: true,
    runValidators: true,
  });
  !task
    ? next(createCustomError("File Not Found", 404))
    : res.status(200).json(task);
});

const deleteTask = asyncWrapper(async (req, res, next) => {
  const { id: delId } = req.params;
  const task = await Task.deleteOne({ _id: delId });
  task.deletedCount === 0
    ? next(createCustomError("File Not Found", 404))
    : res.status(200).json({
        msg: `Successfully deleted task having id:${req.params.id}`,
      });
});

module.exports = {
  readAllTask,
  readTask,
  createTask,
  updateTask,
  deleteTask,
};
