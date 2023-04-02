import mongoose, { Schema, model, models } from 'mongoose';
import { IPost } from '../interface';
mongoose.Promise = global.Promise;

const PostSchema: Schema = new Schema({
    title: String,
    body: { type: String, required: true },
    author: { type: Object, required: true },
    category: String,
    image: String,
    upvotes: Array<String>,
    downvotes: Array<String>,
    blob: String,
    time : { type : Date, default: Date.now },
    approved:{type:Boolean, default: false} ,
});
try {
    delete models.Post
} catch (err) {
    console.log(err);
}
const Post = model<IPost>('Post', PostSchema);

export default Post; 