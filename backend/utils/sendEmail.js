import transporter from "./mail.js";

export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `Travel Agency <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
};
