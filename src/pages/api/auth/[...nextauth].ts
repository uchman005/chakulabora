import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth/next";
import { dbCon } from "../../../../models";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcrypt";
import handleGoogleUser from "../../../../lib/google";
// import SendMail from './../../../lib/send-mail';
const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 2592000,
    updateAge: 86400,
  },

  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "Chakulabora",
      credentials: {},
      async authorize(credentials, req) {
        const { User } = await dbCon();
        let user;
        if (req.body !== undefined) {
          const { email } = req.body;
          user = await User.findOne({
            email: email,
          });
        }
        if (user !== null && user !== undefined) {
          if (
            await bcrypt.compare(req.body?.password, user.password as string)
          ) {
            return {
              id: `${user._id}`,
              email: `${user._id}`,
            };
          } else {
            throw new Error("Password did not Match user Password");
          }
          //   await SendMail(user.email);
        } else {
          throw new Error(
            `User not found, Check the email to ensure there are no typos`
          );
        }
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
    // newUser: "/signup",
    // verifyRequest: "api/verify",
    // error: "",
    // signOut: ""
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (!account) return false;
      if (!profile) return false;
      if (account.provider === "google") {
        const googleUser = {
          id: profile.sub,
          email: profile.email,
          given_name: profile.name,
        };
        await handleGoogleUser(googleUser);
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
      if (token.id) {
        if (!session) {
          return session;
        }
        if (!session.user) {
          session.user = { email: token.id as string };
        }
        session.user.email = token.id as string;
      }
      return session;
    },
  },
};
export default NextAuth(authOptions);
