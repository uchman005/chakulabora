import { dbCon } from "../models";
export const like_answer = async (
  like: boolean,
  answer_id: string,
  author_id: string,
  user_id: string
): Promise<boolean> => {
  const { Answer, User } = await dbCon();

  let answer;
  try {
    answer = await Answer.findOne({ _id: answer_id });
    if (answer === null) {
      answer = false;
      return answer;
    }
    if (answer.upvotes === undefined) {
      answer.upvotes = [];
    }
    if (answer.downvotes === undefined) {
      answer.downvotes = [];
    }
    let upvoted = answer.upvotes.includes(user_id);
    let downvoted = answer.downvotes.includes(user_id);
    if (!upvoted && !downvoted) {
      if (like) {
        answer.upvotes.push(user_id);
      } else {
        answer.downvotes.push(user_id);
      }
      answer.save();
    }
  } catch (error) {
    answer = false;
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

  if (!!answer && !!user) {
    return true;
  } else {
    return false;
  }
};



export const dislike_answer = async (
  like: boolean,
  answer_id: string,
  author_id: string,
  user_id: string
): Promise<boolean> => {
  const { Answer, User } = await dbCon();

  let answer;
  try {
    answer = await Answer.findOne({ _id: answer_id });
    if (answer === null) {
      answer = false;
      return answer;
    }
    if (answer.upvotes === undefined) {
      answer.upvotes = [];
    }
    if (answer.downvotes === undefined) {
      answer.downvotes = [];
    }
    let upvoted = answer.upvotes.includes(user_id);
    let downvoted = answer.downvotes.includes(user_id);
    if (upvoted || downvoted) {
      if (like) {
        answer.upvotes = answer.upvotes.filter((item) => item !== user_id);
      } else {
        answer.downvotes = answer.downvotes.filter((item) => item != user_id);
      }
      answer.save();
    }
  } catch (error) {
    answer = false;
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

  if (!!answer && !!user) {
    return true;
  } else {
    return false;
  }
};
