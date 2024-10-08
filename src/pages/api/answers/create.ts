import { NextApiRequest, NextApiResponse } from "next";
import { dbCon } from "../../../../models";
import { ResponseFunctions } from "../../../../interface";
import notifyAdmin from "../../../../utils/notifyAdmin";
const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
  if (method === "POST") {
    const { author, body, post, blob } = req.body;
    let answer;
    let message: string;
    let stripedContent = body.replace(/<\/?[^>]+(>|$)/g, "").trim() === "";

    if (body.trim() !== "" && !stripedContent) {
      const { Answer } = await dbCon();
      try {
        answer = new Answer({
          body: body,
          author: author,
          post: post,
          upvotes: [],
          downvotes: [],
        });
        await answer.save();
        notifyAdmin(
          "New answer",
          `By ${author ? author?.fname : "Anonymous"} \n
          f${body} \n
          https://chakulabora.net/post/${blob}`
        );
        message = "Post success";
      } catch (err: any) {
        answer = null;
        message = "Error occured";
      }
    } else {
      answer = null;
      message = "The post cannot be empty";
    }
    res.status(200).json({ answer, message });
  } else
    res
      .status(400)
      .json({ error: `No Response for This ${req.method} Request` });
};
export default create;
