import mongoose, { Schema, model, models } from "mongoose";
import { IPost } from "../interface";
import moment from "moment";

mongoose.Promise = global.Promise;

const now = () => moment().format("LLL");  // Use a function for dynamic default value

const AuthorSchema: Schema = new Schema({
  id: { type: String, required: true },
  password: { type: String },  // Add specific types for all fields
  fname: { type: String },
  lname: { type: String },
  email: { type: String },
  role: { type: String },
  bio: { type: String },
  country: { type: String },
  phone: { type: String },
  postal_code: { type: String },
  street_address: { type: String },
  city: { type: String },
  state: { type: String },
  website: { type: String },
}, { _id: false });  // Disable the default _id field for sub-documents

const PostSchema: Schema<IPost> = new Schema({
  title: { type: String, required: true },
  author: { type: AuthorSchema, required: true },  // Use sub-document schema
  category: { type: String },
  // image: { type: String },
  upvotes: [{ type: String }],  // Explicitly define as array of strings
  downvotes: [{ type: String }],
  blob: { type: String, required: true },
  time: { type: String, default: now },  // Use function for dynamic default
  approved: { type: Boolean, default: false },
  solved: { type: Boolean, default: false },
  body: { type: String, required: true },
});

PostSchema.pre("save", async function (next) {
  const doc = this ;

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


// Use existing model if already defined
const Post = models.Post || model<IPost>("Post", PostSchema);

export default Post;
