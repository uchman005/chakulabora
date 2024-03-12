import { NextApiRequest, NextApiResponse } from "next";
import { dbCon } from "../../../../models";
import { ResponseFunctions } from "../../../../interface";

const subscribe = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
  if (method === "POST") {
    const data = req.body;
    
    const { Subscriber } = await dbCon();
    let user;
    const { email } = JSON.parse(data);
    try {
      user = new Subscriber({
        email: email,
      });
      await user.save();
    } catch (err) {
      user = null;
    }
    res.status(200).json(user);
  } else
    res
      .status(400)
      .json({ error: `No Response for This ${req.method} Request` });
};
export default subscribe;
