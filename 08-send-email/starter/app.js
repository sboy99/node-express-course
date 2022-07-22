require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());

// routes
const sendEmail = require("./controllers/sendEmail");
app.get("/", (req, res) => {
  res.send('<h1>Email Project</h1> <a href="/send">Send Email</a>');
});
app.get("/send", sendEmail);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
