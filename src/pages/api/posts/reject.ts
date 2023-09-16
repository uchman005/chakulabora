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
const approve = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
  if (method === "POST") {
    const blob = req.body.blob;
    const { Post } = await dbCon();
    let post;
    try {
      post = await Post.deleteOne({ blob: blob });
    } catch (err) {
      post = false;
    }
    console.log(post);

    res.status(200).json(post);
  } else {
    res
      .status(400)
      .json({ error: `No Response for This ${req.method} Request` });
  }
};
export default approve;
