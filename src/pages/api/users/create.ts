import { NextApiRequest, NextApiResponse } from "next";
import { dbCon } from "../../../../models";
import { ResponseFunctions } from "../../../../interface";
const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
  if (method === "POST") {
    const data = req.body;
    const { User } = await dbCon();
    let user;
    try {
      user = new User({
        email: data.email,
        password: data.password,
        fname: data.fname,
        lname: data.lname,
        bio: data.bio,
        postal_code: data.postal_code,
        country: data.country,
        street_address: data.street_address,
        city: data.city,
        state: data.state,
        phone: data.phone,
        website: data.website,
        role: "Community Member",
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
export default create;
