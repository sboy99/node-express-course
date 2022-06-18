const express = require("express");
const app = express();
const { connectDB } = require("./db/connect");
require("dotenv").config();

const taskManager = require("./routes/task");
const { errorHandler } = require("./middleware/errorHandler");
//Static Files
app.use(express.static("./public"));
//Json Parser
app.use(express.json());
// routes..: /api/v1/task
app.use("/api/v1/task", taskManager);
//Middlewares
app.use(errorHandler);

const start = async () => {
  try {
    const port = process.env.PORT || 5000;
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server Up in ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
