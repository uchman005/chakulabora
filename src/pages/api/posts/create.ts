import { NextApiRequest, NextApiResponse } from "next";
import { dbCon } from "../../../../models";
import { ResponseFunctions } from "../../../../interface";
import SendMail from "../../../../lib/send-mail";

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
    const blob: string = data.title
      .toLowerCase()
      .replaceAll(" ", "-")
      .replace(/[^\w-]+/g, "")
      .replace(/-$/, "");
    const { Post } = await dbCon();
    let post;
    let message: string;
    try {
      post = new Post({
        title: data.title,
        body: data.body,
        author: {
          id: data.author.id,
          email: data.author.email,
          fname: data.author.fname,
          lname: data.author.lname,
        },
        category: data.category,
        image: data.image,
        upvotes: [],
        downvotes: [],
        blob: blob,
      });

      await post.save();
      message = "Post created successfully";
      let mailMessage = 'A new post has been created on the platform by ' + data.author.fname + ' ' + data.author.lname + '. Please, review the post and approve it.';
      await SendMail('uchenna@passionofhope.org', 'New Post Created', mailMessage, mailMessage);
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
