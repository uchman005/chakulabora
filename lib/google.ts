import { IUser } from "../interface";
import { dbCon } from "../models";

/**
 * Handles saving or updating user data when signing in with Google.
 * @param {Object} googleUser - The user data returned from Google authentication.
 * @returns {Promise<IUser>} - The saved or updated user document.
 */
export default async function handleGoogleUser(googleUser: any) {
  const { id, email, given_name } = googleUser;
  const { User } = await dbCon();
  let user = await User.findOne({ $or: [{ email }, { googleId: id }] });

  if (user) {
    user.fname = given_name;
    user.googleId = id;
    await user.save();
  } else {
    user = new User({
      fname: given_name,
      email,
      googleId: id,
    });
    await user.save();
  }
  return user;
}
