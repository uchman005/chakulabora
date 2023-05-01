import mongoose, { Schema, model, models } from 'mongoose';
import { IPost } from '../interface';
import moment from 'moment';
let time = Date.now();
let now = moment().format("LLL");
mongoose.Promise = global.Promise;

const PostSchema: Schema = new Schema({
    title: { type: String, required: true},
    author: {
        type: {
            id: { type: String, required: true },
            password: String,
            fname: String,
            lname: String,
            email: String,
            role: String,
            bio: String,
            country: String,
            phone: String,
            postal_code: String,
            street_address: String,
            city: String,
            state: String,
            website: String
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
    solved: {type: Boolean, default: false},
    body: { type: String, required: true },
});
try {
    delete models.Post
} catch (err) {
    console.log(err);
}
const Post = model<IPost>('Post', PostSchema);

export default Post; 