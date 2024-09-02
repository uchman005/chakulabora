import { NextApiRequest, NextApiResponse } from "next";
import { dbCon } from "../../../../models";
import { IAnswer, IPost, ResponseFunctions } from "../../../../interface";
const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
  if (method === "GET") {
    const user_id = req.query.user;
    const { User, Post, Answer } = await dbCon();
    let posts: Array<IPost> = [];
    let answers: Array<IAnswer> = [];
    try {
      posts = await Post.find();
      answers = await Answer.find();
      posts = posts.filter((item) => item.author.id == user_id);
      answers = answers.filter((item) => item.author?.id == user_id);
    } catch (err: any) {
      res
        .status(400)
        .json({ error: "Did not find user because: " + err.message });
    }
    res.status(200).json({ posts: posts?.length, answers: answers?.length });
  } else return res.status(400).json({ error: "No Response for This Request" });
};
export default create;
