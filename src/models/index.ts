import "server-only";
import { Connection, connect } from "mongoose";
import User from "./User";
import Post from "./Post";
import Answer from "./Answer";
import Subscriber from "./Subscribe";
import Contact from "./Contact";

type MongooseCache = {
  conn: Connection | null;
  promise: Promise<Connection> | null;
};

// Cache on globalThis so dev hot-reloads and serverless warm starts reuse
// a single connection instead of opening a new one per module evaluation.
const globalForMongoose = globalThis as unknown as { _mongoose?: MongooseCache };
const cached: MongooseCache = (globalForMongoose._mongoose ??= {
  conn: null,
  promise: null,
});

const models = { User, Post, Answer, Subscriber, Contact };

export const dbCon = async () => {
  if (cached.conn) {
    return { conn: cached.conn, ...models };
  }

  const { MONGODB_URL_LOCAL } = process.env;
  if (!MONGODB_URL_LOCAL) {
    throw new Error("Please define the MONGODB_URL_LOCAL environment variable");
  }

  if (!cached.promise) {
    cached.promise = connect(MONGODB_URL_LOCAL).then((mongoose) => {
      const conn = mongoose.connection;
      conn.on("error", (err: unknown) => {
        console.error(`Mongoose default connection has occurred ${err} error`);
      });
      return conn;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return { conn: cached.conn, ...models };
};
