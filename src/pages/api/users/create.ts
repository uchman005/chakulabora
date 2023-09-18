import { NextApiRequest, NextApiResponse } from "next";
import { dbCon } from "../../../../models";
import { ResponseFunctions } from "../../../../interface";
import bcrypt from "bcrypt";
const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
  if (method === "POST") {
    const data = req.body;
    const { User } = await dbCon();
    let user;
    const {
      email,
      password,
      fname,
      lname,
      bio,
      postal_code,
      country,
      street_address,
      city,
      state,
      phone,
      website,
    } = data;
    // hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
      user = new User({
        email: email,
        password: hashedPassword,
        fname: fname,
        lname: lname,
        bio: bio,
        postal_code: postal_code,
        country: country,
        street_address: street_address,
        city: city,
        state: state,
        phone: phone,
        website: website,
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
