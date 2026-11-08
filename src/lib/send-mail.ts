import { transporter, mailOptions } from "./email";
/**
 * 
 * @param to default: mailOptions.to - email to send to
 * @param subject default: mailOptions.subject - subject of the email
 * @param text default: mailOptions.text - text of the email
 * @param html default: mailOptions.html - html of the email
 * @description send an email
 */
const SendMail = async (
  to: string = mailOptions.to,
  subject: string = mailOptions.subject,
  text: string = mailOptions.text,
  html: string = mailOptions.html
) => {
  try {
    await transporter.sendMail({
      ...mailOptions,
      to: to,
      subject: subject,
      text: text,
      html: html,
    });
  } catch (err: any) {
    console.log("Mail sending failed: " + err.message);
  }
};
export default SendMail;
