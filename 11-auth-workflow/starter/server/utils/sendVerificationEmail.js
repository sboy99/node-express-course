const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
  const message = `<p>Dear ${name}, <br/> Please confirm your mail </p> <a href="${verifyEmail}">Click Here</a>`;
  return sendEmail({ to: email, subject: `Email Confirmation`, html: message });
};

module.exports = sendVerificationEmail;
