import { Schema, model, models } from "mongoose";
import { IUser } from "@/types";


const UserSchema: Schema = new Schema({
  // Only email is required at signup; profile fields are filled in later from Settings.
  fname: { type: String, trim: true },
  lname: { type: String, trim: true },
  email: { type: String, required: true, unique: true },
  bio: String,
  password: { type: String },
  googleId: { type: String },
  postal_code: String,
  country: String,
  street_address: String,
  city: String,
  state: String,
  phone: String,
  website: String,
  role: { type: String, required: true, default: "Community Member" },
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
