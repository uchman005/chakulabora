import SendMail from "../lib/send-mail";
const peopleToNotify: string[] = [
  "victor@passionofhope.org",
  "brian@passionofhope.org",
  "uchenna@passionofhope.org",
];
/**
 *
 * @param subject {string} - the subject of the email
 * @param message {string} - the message of the email
 * @returns {Promise<void>} - a promise that resolves when the email is sent
 * @description - this function sends an email to the admins of the site
 */
export default function notifyAdmin(subject: string, message: string): void {
  let html = `
    <h1>${subject}</h1>
    <p>${message}</p>
    <p>You are getting this automatic email because the site admin included your email as one of the people to get notified for activities on the chakula bora network</p>
    <p>You can unsubscribe from these notifications by contacting the site admin/Victor</p>
    <p>Regards from Uche, <br/><ahref="https://passionofhope.org">Passion of Hope</a></p>
    `;
  peopleToNotify.forEach((email) => {
    SendMail(email, subject, html, html);
  });
}
