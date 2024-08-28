import { NextApiRequest, NextApiResponse } from "next";
import { dbCon } from "../../../../models";
import { ResponseFunctions } from "../../../../interface";
import SendMail from "../../../../lib/send-mail";
import { randomBytes } from "crypto";
const forgotPassword = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
  if (method === "POST") {
    const { email } = req.body;
    const { User } = await dbCon();

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(200)
          .json({ success: false, message: "User not found" });
      }
      const token = randomBytes(20).toString("hex");

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      await user.save();
      let subject = "Password Reset From Chakulabora Network";
      let message = `Please click the link below to reset your password \n https://chakulabora.net/reset-password/${token} \n  If you did not request this, please ignore this email and your password will remain unchanged.`;

      let html = `<div>
      <h1>${subject}</h1>
      <p>${message}</p>
      <p>The Chakulabora support team</p>
      </div>`;
      SendMail("uchenna@passionofhope.org", subject, message, html);
      SendMail(email, subject, message, html);
      res
        .status(200)
        .json({ success: true, message: "Password reset email sent" });
    } catch (err) {
      res.status(200).json({success: false, message: "Error sending password reset email"});
    }
  } else
    res
      .status(400)
      .json({ error: `No Response for This ${req.method} Request` });
};
export default forgotPassword;
