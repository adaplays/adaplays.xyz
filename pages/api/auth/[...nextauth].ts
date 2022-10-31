import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  // session: {
  //   strategy: "jwt",  // this strategy is also the default one, see: https://next-auth.js.org/getting-started/upgrade-v4#session-strategy
  // },
  // My home page is overloaded to handle both sign in & sign out.
  pages: {
    signIn: '/',
    signOut: '/',
  },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      type: "credentials",  // this is by default, see other default params here: https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/credentials.ts
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {},
      async authorize(credentials, req) {
        const {address, password} = credentials as {
          address: string;
          password: string;
        }

        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        if (address !== 'someDummyAddress' || password !== 'password') {
          return null;
        }
        return { id: '1234', address, password }
      }
    })
  ],
}

export default NextAuth(authOptions)
