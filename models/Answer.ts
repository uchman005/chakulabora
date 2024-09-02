import mongoose, { Schema, model, models } from "mongoose";
import { IAnswer } from "../interface";
import moment from "moment";
let now = moment().format("LLL");
mongoose.Promise = global.Promise;

const AnswerSchema: Schema = new Schema({
  body: { type: String, required: true },
  author: Object,
  post: { type: String, required: true },
  isSolution: { type: Boolean, default: false, required: true },
  time: { type: String, default: now },
  upvotes: Array<String>,
  downvotes: Array<String>,
});

const Answer = models.Answer || model<IAnswer>("Answer", AnswerSchema);
export default Answer;
