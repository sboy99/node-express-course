require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
// ! Extra Sequrity packages...
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
// ? Middlewares..
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authenticateUser = require("./middleware/authentication");
// * Json Parser
app.use(express.json());
// ! extra packages
const authRouter = require("./routes/auth");
const jobRouter = require("./routes/jobs");
// * DtataBase Connection
const connectDB = require("./db/connect");
// * Sequrity..
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);
app.use(cors());
app.use(helmet());
app.use(xss());
// * routes
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Jobs API Prpject");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobRouter);
// * Error Handler..
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log(`Connected!`);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
})();
