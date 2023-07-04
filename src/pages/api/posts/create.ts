import { NextApiRequest, NextApiResponse } from "next";
import { dbCon } from "../../../../models";
import { ResponseFunctions } from "../../../../interface";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Set desired value here
    },
  },
};
const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
  if (method === "POST") {
    const data = req.body;
    const random: string = Math.ceil(Math.random() * 10000 + 1).toString();
    const blob: string =
      data.title
        .replaceAll(" ", "-")
        .toLowerCase()
        .replace(/[^\w-]+/g, "") +
      "-" +
      random;
    const { Post } = await dbCon();
    let post;
    let message: string;
    try {
      post = new Post({
        title: data.title,
        body: data.body,
        author: data.author,
        category: data.category,
        upvotes: [],
        downvotes: [],
        blob: blob,
      });

      await post.save();
      message = "Post created successfully";
    } catch (err: any) {
      post = null;
      if (err.name === "MongoError" && err.code === 11000) {
        message =
          "You are trying to create a post that already exists. Please, search posts for similar post or change your title.";
      } else message = err.message;
    }
    res.status(200).json({ post, message });
  } else
    res
      .status(400)
      .json({ error: `No Response for This ${req.method} Request` });
};
export default create;