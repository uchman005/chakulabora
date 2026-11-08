import mongoose, { Schema, model, models } from "mongoose";
import { IContact } from "../interface";
import moment from "moment";
let now = moment().format("LLL");
mongoose.Promise = global.Promise;

const ContactSchema: Schema = new Schema({
  email: String,
  name: String,
  message: String,
  subject: String,
  time: { type: String, default: now },
});
try {
  delete models.Contact;
} catch (err) {
  console.log(err);
}
const Contact = model<IContact>("Contact", ContactSchema);

export default Contact;