import mongoose, { Schema, model, models } from 'mongoose';
import { IPost } from '../interface';
import { timeStamp } from 'console';
mongoose.Promise = global.Promise;

const PostSchema: Schema = new Schema({
    title: String,
    body: { type: String, required: true },
    author: { type: Object, required: true },
    category: String,
    image: String,
    upvotes: Number,
    downvotes: Number,
    blob: String,
});
try {
    delete models.User
} catch (err) {
    console.log(err);
}
const User = model<IPost>('User', PostSchema);

export default User; 