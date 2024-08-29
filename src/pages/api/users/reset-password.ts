import { NextApiRequest, NextApiResponse } from "next";
import { dbCon } from "../../../../models";
import { ResponseFunctions } from "../../../../interface";
import { genSalt, hash } from "bcrypt";

const resetPassword = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
  if (method === "POST") {
    const { token, password } = req.body;
    const { User } = await dbCon();

    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(200).json({
          success: false,
          message: "User not found or token is invalid",
        });
      }

      const salt = await genSalt(10);
      user.password = await hash(password, salt);
      user.resetPasswordToken = undefined; 
      user.resetPasswordExpires = undefined; 
      await user.save();
      res
        .status(200)
        .json({ success: true, message: "Password has been reset" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  } else
    res
      .status(400)
      .json({ error: `No Response for This ${req.method} Request` });
};
export default resetPassword;
