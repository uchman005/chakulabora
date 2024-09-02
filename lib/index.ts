import { dbCon } from "../models";
export const like_post = async (
  like: boolean,
  post_id: string,
  author_id: string,
  user_id: string
): Promise<boolean> => {
  const { Post, User } = await dbCon();

  let post;
  try {
    post = await Post.findOne({ _id: post_id });
    if (post === null) {
      post = false;
      return post;
    }
    if (post.upvotes === undefined) {
      post.upvotes = [];
    }
    if (post.downvotes === undefined) {
      post.downvotes = [];
    }
    let upvoted = post.upvotes.includes(user_id);
    let downvoted = post.downvotes.includes(user_id);
    if (!upvoted && !downvoted) {
      if (like) {
        post.upvotes.push(user_id);
      } else {
        post.downvotes.push(user_id);
      }
      post.save();
    }
  } catch (error) {
    post = false;
  }

  let user;
  try {
    user = await User.findOne({ _id: author_id });
    if (user === null) {
      return false;
    }
    if (user.pv === undefined) {
      user.pv = 0;
    }
    if (like) {
      user.pv += 1;
    } else {
      user.pv -= 1;
    }
    user.save();
  } catch (error) {
    user = false;
  }

  if (!!post && !!user) {
    return true;
  } else {
    return false;
  }
};

export const dislike_post = async (
  like: boolean,
  post_id: string,
  author_id: string,
  user_id: string
): Promise<boolean> => {
  const { Post, User } = await dbCon();

  let post;
  try {
    post = await Post.findOne({ _id: post_id });
    if (post === null) {
      post = false;
      return post;
    }
    if (post.upvotes === undefined) {
      post.upvotes = [];
    }
    if (post.downvotes === undefined) {
      post.downvotes = [];
    }
    let upvoted = post.upvotes.includes(user_id);
    let downvoted = post.downvotes.includes(user_id);
    if (upvoted || downvoted) {
      if (like) {
        post.upvotes = post.upvotes.filter((item: string) => item !== user_id);
      } else {
        post.downvotes = post.downvotes.filter((item: string) => item != user_id);
      }
      post.save();
    }
  } catch (error) {
    post = false;
  }

  let user;
  try {
    user = await User.findOne({ _id: author_id });
    if (user === null) {
      return false;
    }
    if (user.pv === undefined) {
      user.pv = 0;
    }
    if (like) {
      user.pv -= 1;
    } else {
      user.pv += 1;
    }
    user.save();
  } catch (error) {
    user = false;
  }

  if (!!post && !!user) {
    return true;
  } else {
    return false;
  }
};
