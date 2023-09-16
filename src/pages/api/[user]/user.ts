import { NextApiRequest, NextApiResponse } from "next";
import { dbCon } from "../../../../models";
import { ResponseFunctions } from "../../../../interface";
const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
  if (method === "GET") {
    const { User } = await dbCon();
    let user;
    try {
      user = await User.findOne({
        _id: req.query.user,
      });
    } catch (err: any) {
      res
        .status(400)
        .json({ error: "Did not find user because: " + err.message });
    }
    res.status(200).json(user);
  } else return res.status(400).json({ error: "No Response for This Request" });
};
export default create;
