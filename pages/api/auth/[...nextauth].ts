// maybe make maxage to be one day.

import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { User } from "next-auth"
import type { jwtUser } from 'types/types'

export const authOptions: NextAuthOptions = {
  // Credentials provider can only be used if JSON Web Tokens are enabled for sessions.
  // session: {
  //   strategy: "jwt",  // this strategy is also the default one, see: https://next-auth.js.org/getting-started/upgrade-v4#session-strategy
  // },
  // My home page is overloaded to handle both sign in & sign out.
  // Actually, I am never visiting these pages in my logic as I am still on same page after signout & also signin and this behavious as nothing to do with redirect.
  pages: {
    signIn: '/',
    signOut: '/',
  },
  // why callbacks? https://stackoverflow.com/questions/64576733/where-and-how-to-change-session-user-object-after-signing-in
  // safe to put password here: https://stackoverflow.com/questions/71013909/is-it-safe-to-store-access-token-in-next-auth-session
  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user)
      return token
    },
    session: async ({ session, token }) => {
      // `as` is added following https://bobbyhadz.com/blog/typescript-type-unknown-is-not-assignable-to-type
      // Depreciated Note [as I imported `User` type]: earlier, instead of `name` my property was `address` which led to this error: https://bobbyhadz.com/blog/typescript-type-has-no-properties-in-common-with-type
      session.user = token.user as User
      return session
    }
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
        const {id, password} = credentials as jwtUser
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        if (id !== 'yourWalletAddress' || password !== 'HelloS#d31nk') {
          return null;
        }
        return { id, password } as jwtUser
      },
    })
  ],
}

export default NextAuth(authOptions)
