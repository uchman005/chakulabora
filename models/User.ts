import mongoose, { Schema, model, models } from 'mongoose';
import { IUser } from '../interface';

mongoose.Promise = global.Promise;

const UserSchema: Schema = new Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    bio: { type: String, required: true },
    password: { type: String, required: true },
    postal_code: { type: String, required: true },
    country: { type: String },
    street_address: { type: String },
    city: { type: String },
    state: { type: String },
    phone: { type: String },
    website: { type: String },
    role: { type: String, required: true },
});
try {
    delete models.User
} catch (err) {
    console.log(err);
}
const User = model<IUser>('User', UserSchema);

export default User; 