const jwt = require("jsonwebtoken");
const ERR = require("../errors");
const login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ERR.BAD_REQUEST("Please Provide Username and Password Both");
  }
  const id = new Date().getTime().toString();
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  res.status(201).json({ msg: `Login Approved`, token });
};

//Dashboard...
const dashboard = (req, res) => {
  const luckyNum = Math.floor(Math.random() * 100);
  const { username, id } = req.authorizedData;
  res.json({
    msg: `Hello ${username}`,
    secret: `Your lucky num: ${luckyNum}`,
  });
};

module.exports = { login, dashboard };
