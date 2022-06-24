//DB Model
const Products = require("../models/product");
const throwError = require("../custom/customAPIError");
const asyncWrapper = require("../Wrapper/asyncWrapper");

//Find By Query...
const getAllProducts = asyncWrapper(async (req, res, next) => {
  //Its better to destructuring either we will endup with empty list often.
  const { featured, company, name, sort, select, numericFilter } = req.query;
  const queryObj = {};
  if (featured) {
    queryObj.featured = featured;
  }
  if (company) {
    queryObj.company = { $regx: company, $options: "i" };
  }
  if (name) {
    queryObj.name = { $regex: name, $options: "i" };
  }

  if (numericFilter) {
    const operatorTranslator = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(>|>=|<|<=|=)\b/g;
    let filter = numericFilter.replace(
      regEx,
      (match) => `-${operatorTranslator[match]}-`
    );
    const options = ["price", "rating"]; //Options only contains numeric value
    filter = filter.split(",").forEach((exp) => {
      const [field, operator, value] = exp.split("-");
      if (options.includes(field)) {
        queryObj[field] = { [operator]: Number(value) };
      }
    });
  }
  let result = Products.find(queryObj);

  if (sort) {
    const sortOrder = sort.split(",").join(" ");
    result.sort(sortOrder);
  } else {
    result = result.sort("createdAt name");
  }
  if (select) {
    const selectList = select.split(",").join(" ");
    result = result.select(selectList);
  }
  const page = Number(req.query?.page) || 1;
  const limit = Number(req.query?.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);
  const products = await result;
  if (!products.length) return next(throwError(`can't find anything`, 404));
  res
    .status(200)
    .json({ success: true, total: products.length, data: products });
});

const getSingleProduct = asyncWrapper(async (req, res, next) => {
  const { id: productId } = req.params;
  const product = await Products.findOne({ _id: productId });
  if (!product)
    return next(throwError(`Can't find product with id:${productId}`, 404));
  res.status(200).json({ success: true, data: product });
});

const createProduct = asyncWrapper(async (req, res) => {
  const product = await Products.create(req.body);
  res.status(200).json({ success: true, data: product });
});

const updateProduct = (req, res) => {
  res.send(`Update Product`);
};

const deleteProduct = (req, res) => {
  res.send(`Delete Product`);
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
