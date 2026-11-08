import mongoose, { Schema, model, models } from "mongoose";
import { ISubscriber } from "../interface";
import moment from "moment";
let now = moment().format("LLL");
mongoose.Promise = global.Promise;

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
