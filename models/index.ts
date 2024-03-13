import mongoose from "mongoose";
import User from "./User";
import Post from "./Post";
import Answer from "./Answer";
import Subscriber from "./Subscribe";
import Contact from "./Contact";
const { MONGODB_URL_LOCAL } = process.env;

export const dbCon = async () => {
  const conn = await mongoose.connect(
    MONGODB_URL_LOCAL as string,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions
  );
  const db = mongoose.connection;
  db.on("connected", () => {
    console.log("Mongoose default connection is open");
  });
  db.on("error", (err: any) => {
    console.log(`Mongoose default connection has occured ${err} error`);
  });
  return {
    conn,
    User,
    Post,
    Answer,
    Subscriber,
    Contact
  };
};
