import { transporter, mailOptions } from "./email";

const SendMail = async (to: string = mailOptions.to, subject: string = mailOptions.subject, text: string = mailOptions.text, html: string = mailOptions.html) => {
    try {
        await transporter.sendMail({
            ...mailOptions,
            to: to,
            subject: subject,
            text: text,
            html: html
        });

    } catch (err:any) {
        console.log("Mail sending failed: " + err.message);
    }
}
export default SendMail;