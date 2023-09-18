import { NextApiRequest, NextApiResponse } from "next";
import { dbCon } from "../../../../models";
import { ResponseFunctions } from "../../../../interface";
import bcrypt from "bcrypt";
const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
  if (method === "POST") {
    const { id, password } = req.body.data;
    const { User } = await dbCon();
    let user;
    let updated: boolean = false;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      user = await User.findOne({
        _id: id,
      });
      if (user !== null) {
        user.password = hashedPassword;
        await user.save();
        updated = true;
      } else {
        updated = false;
      }
    } catch (err) {
      if (err) updated = false;
    }
    res.status(200).json(updated);
  } else
    res
      .status(400)
      .json({ error: `No Response for This ${req.method} Request` });
};
export default create;
