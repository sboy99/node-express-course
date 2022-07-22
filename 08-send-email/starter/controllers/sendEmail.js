const sendMail = require("../mail/sendMail");

const sendEmail = async (req, res) => {
  const info = await sendMail(
    `"Tumpa Sona" <abc@gmail.com>`,
    "mumua@gmail.com"
  );
  res.json(info);
};

module.exports = sendEmail;
