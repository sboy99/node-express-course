// console.log('04 Store API')
const express = require("express");
const errorHandlerMiddleware = require("./middleware/error-handler");
const productsRouter = require("./routes/products");
const connectDB = require("./db/connect");
const cors = require("cors");
const app = express();
require("dotenv").config();

//Json,Middleware
app.use(cors());
app.use(express.json());
app.use("/api/v1/products", productsRouter);
app.use(errorHandlerMiddleware);
//Connect to server
(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server Up in Port: ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
