require("dotenv").config();
require("express-async-errors");

//express
const express = require("express");
const app = express();

//additonal Packages
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//!Sequrity Packages!//
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

//sqqurities
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

//utilities
app.use(fileUpload({ useTempFiles: true }));
//parsers
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());
app.use(express.static("./public"));

//database
const connectDB = require("./db/connect");

//routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productsRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");

//middlewares packages
const errorHandler = require("./middleware/error-handler");
const notFound = require("./middleware/not-found");

// server setup
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

// Deploying Middlewares
app.use(notFound);
app.use(errorHandler);

// start
const port = process.env.PORT || 3000;
(async () => {
  try {
    // Connecting to database
    await connectDB(process.env.MONGO_URI);
    // Listening..
    app.listen(port, () => {
      console.log(`Server is listening on port: ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
})();
