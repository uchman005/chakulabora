import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";
import { dbCon } from "../../../../models";
import { NextAuthOptions } from "next-auth";
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
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Chakulabora",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {},

            async authorize(credentials, req) {

                // Add logic here to look up the user from the credentials supplied
                const { User } = await dbCon();
                let user ;
                if(req.body !== undefined){
                     user = await User.findOne({
                        email: req.body.email,
                        password: req.body.password
                    })
                }

                // Any object returned will be saved in `user` property of the JWT
                if (user !== null && user !== undefined) {
                    // This function will be called anytime to send mails
                    //   await SendMail(user.email);
                    return {
                        id: `${user._id}`,
                        email: user.email,
                        name: user.fname,
                        role: user.role
                    }
                } else {
                    throw new Error(`Invalid credentials`);
                }
            }
        })
    ],
    pages: {
        signIn: "/auth/signin",
        // newUser: "/signup",
        // verifyRequest: "api/verify",
        // error: "",
        // signOut: ""
    },
    secret: "test",
    jwt: {

    }
}
export default NextAuth(authOptions);


