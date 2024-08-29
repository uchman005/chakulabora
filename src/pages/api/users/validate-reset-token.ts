import { NextApiRequest, NextApiResponse } from "next";
import { dbCon } from "../../../../models";
import { ResponseFunctions } from "../../../../interface";

const validateToken = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
  if (method === "GET") {
    const { token } = req.query;
    const { User } = await dbCon();
    try {
     const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }).select('email fname lname');
     console.log(user);
     
     if(!user){
      return res.status(200).json({success: false, message: "Invalid or expired token. Please request a new password reset."})
     }
     res.status(200).json({success: true, message: "Token is valid", user: user});     
    } catch (err) {
      res.status(200).json({success: false, message: "Error validating token"});
    }
  } else
    res
      .status(400)
      .json({ error: `No Response for This ${req.method} Request` });
};
export default validateToken;
