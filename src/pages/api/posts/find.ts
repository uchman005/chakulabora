import { NextApiRequest, NextApiResponse } from "next";
import { dbCon } from "../../../../models";
import { ResponseFunctions } from "../../../../interface";
export const config = {
  api: {
    bodyParser: {
      responseLimit: false,
    },
  },
};
const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
  if (method === "POST") {
    const { Post } = await dbCon();
    let posts = await Post.find({ approved: true }, { body: 0 });
    res.status(200).json(posts);
  } else {
    res
      .status(400)
      .json({ error: `No Response for This ${req.method} Request` });
  }
};
export default create;
