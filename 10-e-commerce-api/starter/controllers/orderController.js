const Orders = require("../models/order");
const Products = require("../models/product");

const err = require("../errors");
const { StatusCodes: sts } = require("http-status-codes");
const { checkPermission } = require("../utils");

//> Fake Stripe API ID <//
const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

//todo:Get All Orders// [Sort]
const getAllOrders = async (req, res) => {
  const orders = await Orders.find({}).populate({
    path: "user",
    select: "name",
    ref: "Users",
  });

  res.status(sts.OK).json({ count: orders.length, orders });
};

//Get Single Order//
const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Orders.findOne({ _id: orderId });
  if (!order)
    throw new err.NotFoundError(`Order not found with id : ${orderId}`);
  checkPermission(req.user, order.user);

  res.status(sts.OK).json({ order });
};

//Show Current Orders//
const getCurrentUserOrders = async (req, res) => {
  const orders = await Orders.find({ user: req.user.userId }).sort("createdAt");

  res.status(sts.OK).json({ count: orders.length, orders });
};

//Create order//
const creatOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1)
    throw new err.BadRequestError(`Cart is Empty`);
  if (!tax || !shippingFee)
    throw new err.BadRequestError(`No Tax or ShippingFee provided`);

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Products.findOne({ _id: item.product });
    if (!dbProduct)
      throw new err.NotFoundError(`Product not found with id:${item.product}`);

    const { name, price, image, _id } = dbProduct;
    const singleProductObject = {
      name,
      image,
      price,
      amount: item.amount,
      product: _id,
    };
    (orderItems = [...orderItems, singleProductObject]),
      (subtotal += item.amount * price);
  }
  const total = tax + shippingFee + subtotal;

  //Get Stripe Intent//
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  const order = await Orders.create({
    tax,
    shippingFee,
    subtotal,
    total,
    user: req.user.userId,
    clientSecret: paymentIntent.client_secret,
    orderItems,
  });

  res.status(sts.CREATED).json({ order, clientSecret: order.clientSecret });
};

//Update Order//
const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntendId } = req.body;
  if (!paymentIntendId)
    throw new err.BadRequestError(`Please Provide PaymentIntendId`);

  const order = await Orders.findOne({ _id: orderId });
  if (!order)
    throw new err.NotFoundError(`Order not found with id: ${orderId}`);
  checkPermission(req.user, order.user);
  order.paymentIntendId = paymentIntendId;
  order.status = "paid";
  await order.save();

  res.status(sts.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getCurrentUserOrders,
  getSingleOrder,
  creatOrder,
  updateOrder,
};
