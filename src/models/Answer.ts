import { Schema, model, models } from "mongoose";
import { IAnswer } from "@/types";
import moment from "moment";
// Evaluated per document (previously computed once at server start).
const now = () => moment().format("LLL");

const AnswerSchema: Schema = new Schema({
  body: { type: String, required: true },
  author: Object,
  post: { type: String, required: true },
  isSolution: { type: Boolean, default: false, required: true },
  time: { type: String, default: now },
  upvotes: [String],
  downvotes: [String],
});

const Answer = models.Answer || model<IAnswer>("Answer", AnswerSchema);
export default Answer;
