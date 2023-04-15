import mongoose, { Schema, model, models } from 'mongoose';
import { IPost } from '../interface';
import moment from 'moment';
let time = Date.now();
let now = moment().format("LLL");
mongoose.Promise = global.Promise;

const PostSchema: Schema = new Schema({
    title: { type: String, required: true, unique: true },
    author: {
        type: {
            id: { type: String, required: true },
            password: { type: String },
            fname: { type: String, required: true },
            lname: { type: String, required: true },
            email: { type: String, required: true },
            role: { type: String, required: true },
            bio: { type: String, required: true },
            country: { type: String, required: true },
            phone: { type: String, required: true },
            postal_code: { type: String, required: true },
            street_address: { type: String, required: true },
            city: { type: String },
            state: { type: String },
            website: { type: String }
        }
        , required: true
    },
    category: String,
    image: String,
    upvotes: Array<String>,
    downvotes: Array<String>,
    blob: { type: String, required: true, unique: true },
    time: { type: String, default: now },
    approved: { type: Boolean, default: false },
    body: { type: String, required: true },
});
try {
    delete models.Post
} catch (err) {
    console.log(err);
}
const Post = model<IPost>('Post', PostSchema);

export default Post; 