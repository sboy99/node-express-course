const mail = require("nodemailer");

const sendMail = async (sender, recievers) => {
  let testAccount = await mail.createTestAccount();
  let transporter = mail.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "van.hansen3@ethereal.email",
      pass: "tENXcAN9xU3sM5QVdR",
    },
  });

  let info = await transporter.sendMail({
    from: sender,
    to: recievers,
    subject: "Hello",
    text: "Hello Dear",
    html: "<h2>Super</h2>",
  });
  return info;
};

module.exports = sendMail;
