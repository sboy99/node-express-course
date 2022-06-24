require("dotenv").config();
const connectDB = require("./db/connect");
const customProducts = require("./products.json");
const Product = require("./models/product");

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Product.deleteMany({}); //Clearing Database
    await Product.create(customProducts);
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
