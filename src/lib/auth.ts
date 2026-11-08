import "server-only";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { dbCon } from "@/models";
import handleGoogleUser from "@/lib/google";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 2592000,
    updateAge: 86400,
  },

  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "Chakulabora",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        const { User } = await dbCon();
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error(
            `User not found, Check the email to ensure there are no typos`
          );
        }
        if (!user.password || !(await bcrypt.compare(password, user.password as string))) {
          throw new Error("Password did not Match user Password");
        }
        // The app identifies users by their Mongo id, stored in session.user.email.
        return {
          id: `${user._id}`,
          email: `${user._id}`,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (!account) return false;
      if (account.provider === "google") {
        if (!profile) return false;
        await handleGoogleUser({
          id: profile.sub,
          email: profile.email,
          given_name: profile.name,
        });
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && account.provider === "google") {
        const { User } = await dbCon();
        const dbUser = await User.findOne({
          googleId: account.providerAccountId,
        });
        if (dbUser) {
          token.id = dbUser._id.toString();
        }
      } else if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id && session) {
        if (!session.user) {
          session.user = { email: token.id as string };
        }
        session.user.email = token.id as string;
      }
      return session;
    },
  },
};
