import { NextApiRequest, NextApiResponse } from "next";
import { dbCon } from "../../../../models";
import { IAnswer, ResponseFunctions } from "../../../../interface";

const find = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const method: keyof ResponseFunctions = req.method as keyof ResponseFunctions;
  const { Answer } = await dbCon();
  if (method === "POST") {
    let answers: Array<IAnswer> | null;

    try {
      // Aggregate to compute the length of upvotes array and sort by it
      answers = await Answer.aggregate([
        { $match: { post: id } }, // Filter by post ID
        { $addFields: { upvotesCount: { $size: "$upvotes" } } }, // Add a field with the size of upvotes array
        { $sort: { upvotesCount: -1 } }, // Sort by upvotes count in descending order
      ]);
    } catch (err) {
      console.error(err);
      answers = null;
    }

    res.status(200).json(answers);
  } else if (method === "GET") {
    //deletes the answer
    try {
      const answer = await Answer.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: "Answer deleted" });
    } catch (err) {
      res.status(400).json({ success: false, message: "Error deleting answer" });
    }
  } else {
    res
      .status(400)
      .json({ error: `No Response for This ${req.method} Request` });
  }
};
export default find;
