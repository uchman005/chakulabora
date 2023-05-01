import nodemailer from 'nodemailer';
const { EMAIL, EMAIL_PASSWORD } = process.env;
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});
export const mailOptions = {
  from: EMAIL,
  to: "marcel.uchenna.g20@gmail.com",
  subject: "Test mail",
  text: "Test mail",
  html: "<div style='margin: 40px 50px; padding: 15%; background-color: red'><h1>Test mail</h1><p>Test mail</p></div>"
}