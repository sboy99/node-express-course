const express = require("express");
const router = express.Router();

const {
  readAllTask,
  readTask,
  createTask,
  updateTask,
  deleteTask,
} = require("../controller/task");
// router.get('/',(req,res)=>{})

router.route("/").get(readAllTask).post(createTask);

router.route("/:id").get(readTask).patch(updateTask).delete(deleteTask);

module.exports = router;
