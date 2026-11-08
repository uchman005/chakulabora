import { Schema, model, models } from "mongoose";
import { IContact } from "@/types";
import moment from "moment";
// Evaluated per document (previously computed once at server start).
const now = () => moment().format("LLL");

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