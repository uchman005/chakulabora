import mongoose, { Schema, model, models } from "mongoose";
import { IPost } from "../interface";
import moment from "moment";
let now = moment().format("LLL");
mongoose.Promise = global.Promise;

const PostSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: {
    type: {
      id: { type: String, required: true },
      fname: String,
      lname: String,
      email: String,
    },
    required: true,
  },
  category: String,
  image: String,
  upvotes: Array<String>,
  downvotes: Array<String>,
  blob: { type: String, required: true },
  time: { type: String, default: now },
  approved: { type: Boolean, default: false },
  solved: { type: Boolean, default: false },
  body: { type: String, required: true },
});
PostSchema.pre("save", async function (next) {
  const doc = this;

  // Only modify the blob during creation
  if (doc.isNew) {
    try {
      let isUnique = false;

      // Ensure uniqueness for blob field
      while (!isUnique) {
        const existingDoc = await models.Post.findOne({ blob: doc.blob });
        if (!existingDoc) {
          isUnique = true;
        } else {
          doc.blob = `${doc.blob}-${Math.floor(Math.random() * 1000)}`;
        }
      }
    } catch (error) {
      return next();
    }
  }

  next();
});

const Post = models.Post || model<IPost>("Post", PostSchema);

export default Post;
