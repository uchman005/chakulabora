import mongoose, { Schema, model, models } from "mongoose";
import { IUser } from "../interface";

mongoose.Promise = global.Promise;

const UserSchema: Schema = new Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bio: String,
  password: { type: String, required: true },
  postal_code: String,
  country: String,
  street_address: String,
  city: String,
  state: String,
  phone: String,
  website: String,
  role: { type: String, required: true },
  pv: { type: Number, default: 0 },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});
try {
  delete models.User;
} catch (err) {
  console.log(err);
}
const User = model<IUser>("User", UserSchema);

export default User;
