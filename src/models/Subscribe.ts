import { Schema, model, models } from "mongoose";
import { ISubscriber } from "@/types";
import moment from "moment";
// Evaluated per document (previously computed once at server start).
const now = () => moment().format("LLL");

const SubscriberSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  time: { type: String, default: now },
});
try {
  delete models.Subscriber;
} catch (err) {
  console.log(err);
}
const Subscriber = model<ISubscriber>("Subscriber", SubscriberSchema);

export default Subscriber;
