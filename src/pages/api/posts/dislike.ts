import { NextApiRequest, NextApiResponse } from "next";
import { ResponseFunctions } from "../../../../interface";
import { dislike_post } from "../../../../lib";
const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
  if (method === "POST") {
    const { like, post_id, author_id, user_id } = req.body;
    const liked = await dislike_post(like, post_id, author_id, user_id);
    res.status(200).json(liked);
  } else {
    res
      .status(400)
      .json({ error: `No Response for This ${req.method} Request` });
  }
};
export default create;
