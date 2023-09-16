import { NextApiRequest, NextApiResponse } from "next";
import { dbCon } from "../../../../models";
import { IAnswer, ResponseFunctions } from "../../../../interface";
const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
  if (method === "POST") {
    const { Answer } = await dbCon();
    let answer: Array<IAnswer> | null;
    try {
      answer = await Answer.find({ post: id });
    } catch (err) {
      answer = null;
    }
    res.status(200).json(answer);
  } else {
    res
      .status(400)
      .json({ error: `No Response for This ${req.method} Request` });
  }
};
export default create;
