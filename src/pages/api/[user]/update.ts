import { NextApiRequest, NextApiResponse } from "next";
import { dbCon } from "../../../../models";
import { ResponseFunctions } from "../../../../interface";
const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
  if (method === "POST") {
    const { User } = await dbCon();
    let user;
    let data = req.body;
    try {
      user = await User.findOne({
        _id: req.query.user,
      });
    } catch (err: any) {
      res
        .status(400)
        .json({ error: "Did not find user because: " + err.message });
    }
    if (user != null) {
      user.fname = data.fname;
      user.lname = data.lname;
      user.bio = data.bio;
      user.email = data.email;
      user.phone = data.phone;
      user.city = data.city;
      user.website = data.website;
      user.country = data.country;
      user.postal_code = data.postal_code;
      user.state = data.state;
      user.street_address = data.street_address;
      await user?.save();
    }
    res.status(200).json(user);
  } else return res.status(400).json({ error: "No Response for This Request" });
};
export default create;
