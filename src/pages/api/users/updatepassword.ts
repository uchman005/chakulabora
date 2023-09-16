import { NextApiRequest, NextApiResponse } from "next";
import { dbCon } from "../../../../models";
import { ResponseFunctions } from "../../../../interface";
const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
  if (method === "POST") {
    const data = req.body;
    const { User } = await dbCon();
    let user;
    let updated: boolean = false;
    try {
      user = await User.findOne({
        _id: data.id,
      });
      if (user !== null) {
        user.password = data.password;
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
