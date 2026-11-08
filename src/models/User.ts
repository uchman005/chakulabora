import { Schema, model, models } from "mongoose";
import { IUser } from "@/types";


const UserSchema: Schema = new Schema({
  // Accounts need an email or a phone number; profile fields are filled in later from Settings.
  fname: { type: String, trim: true },
  lname: { type: String, trim: true },
  email: {
    type: String,
    required: function (this: { loginPhone?: string }) {
      return !this.loginPhone;
    },
    // Partial, so any number of phone-only accounts can have no email.
    index: { unique: true, partialFilterExpression: { email: { $type: "string" } } },
  },
  // E.164 sign-in number. Separate from the free-form profile `phone`, which is neither
  // normalised nor unique in existing data.
  loginPhone: {
    type: String,
    index: { unique: true, partialFilterExpression: { loginPhone: { $type: "string" } } },
  },
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
