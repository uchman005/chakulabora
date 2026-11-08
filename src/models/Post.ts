import { Schema, model, models } from "mongoose";
import { IPost } from "@/types";
import moment from "moment";
// Evaluated per document (previously computed once at server start).
const now = () => moment().format("LLL");

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
  upvotes: [String],
  downvotes: [String],
  blob: { type: String, required: true },
  time: { type: String, default: now },
  approved: { type: Boolean, default: false },
  solved: { type: Boolean, default: false },
  body: { type: String, required: true },
});
// Mongoose 9: async middleware resolves instead of calling `next()`.
PostSchema.pre("save", async function () {
  // Only make the blob (URL slug) unique when the post is first created.
  if (!this.isNew) return;
  try {
    while (await this.model("Post").exists({ blob: this.get("blob") })) {
      this.set("blob", `${this.get("blob")}-${Math.floor(Math.random() * 1000)}`);
    }
  } catch {
    // Lookup failure: save with the original blob, as before.
  }
});

const Post = models.Post || model<IPost>("Post", PostSchema);

export default Post;
