const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async ({
  name,
  email,
  passwordToken,
  origin,
}) => {
  const url = `${origin}/user/reset-password?token=${passwordToken}&email=${email}`;
  const html = `<h2>Dear ${name},</br>Please Reset Your password: <a href="${url}">Reset Password</a></br>Thank You.. </h2>`;

  return sendEmail({ to: email, subject: `Reset Your Password`, html });
};

module.exports = sendResetPasswordEmail;
