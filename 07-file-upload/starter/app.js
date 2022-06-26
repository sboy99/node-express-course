require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
//Cloudnary
const cloudnary = require("cloudinary").v2;
cloudnary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
// User Inputs..
app.use(express.json());
app.use(fileUpload({ useTempFiles: true })); //? UseTempFiles

//public
app.use(express.static("./public"));

//routers
const productRouter = require("./routes/productRoutes");

// database
const connectDB = require("./db/connect");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// serving request
app.get("/", (req, res) => {
  res.send("<h1>File Upload Starter</h1>");
});
app.use("/api/v1/products", productRouter);

// middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// !Server Start
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
