import { NextApiRequest, NextApiResponse } from "next";
import { dbCon } from "../../../../models";
import { ResponseFunctions } from "../../../../interface";
import SendMail from "../../../../lib/send-mail";

const subscribe = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
  if (method === "POST") {
    const data = req.body;

    const { Contact } = await dbCon();
    let user;
    let { email, name, message, subject } = data;
    try {
      user = new Contact({
        email: email,
        name: name,
        message: message,
        subject: subject,
      });
      subject += " From Chakulabora Network";
      message += "\n ";
      message += "from ";
      message += email;
      let html = `<div>
      <h1>${subject}</h1>
      <p>${message}</p>
      </div>`;
      await user.save();
      SendMail("uchenna@passionofhope.org", subject, message, html);
      SendMail("admin@passionofhope.org", subject, message, html);
      res.status(200).json({ message: "Successfully Sent" });
    } catch (err) {
      res.status(200).json(null);
    }
  } else
    res
      .status(400)
      .json({ error: `No Response for This ${req.method} Request` });
};
export default subscribe;
