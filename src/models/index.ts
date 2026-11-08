import { Connection, ConnectOptions, connect } from "mongoose";
import User from "./User";
import Post from "./Post";
import Answer from "./Answer";
import Subscriber from "./Subscribe";
import Contact from "./Contact";

const { MONGODB_URL_LOCAL } = process.env;

if (!MONGODB_URL_LOCAL) {
  throw new Error("Please define the MONGODB_URL_LOCAL environment variable");
}

let cachedConnection: { conn: Connection | null; promise: Promise<Connection> | null } = { conn: null, promise: null };

export const dbCon = async () => {
  // If a connection is already established, return it.
  if (cachedConnection.conn) {
    return {
      conn: cachedConnection.conn,
      User,
      Post,
      Answer,
      Subscriber,
      Contact,
    };
  }

  // If a connection promise is not yet set, initialize it.
  if (!cachedConnection.promise) {
    const options: ConnectOptions = {};
    
    // Establish a new connection and store it in the promise.
    cachedConnection.promise = connect(MONGODB_URL_LOCAL, options).then((mongoose) => mongoose.connection);
  }

  // Await the promise and set the connection.
  cachedConnection.conn = await cachedConnection.promise;

  // Setup event listeners for the connection, ensuring they're added only once.
  cachedConnection.conn.on("connected", () => {
    console.log("Mongoose default connection is open");
  });

  cachedConnection.conn.on("error", (err: any) => {
    console.error(`Mongoose default connection has occurred ${err} error`);
  });

  return {
    conn: cachedConnection.conn,
    User,
    Post,
    Answer,
    Subscriber,
    Contact,
  };
};
