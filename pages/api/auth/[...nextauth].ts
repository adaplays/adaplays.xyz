import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { User } from "next-auth"

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
      session.user = token.user as User
      return session
    }
  },
  providers: [
    CredentialsProvider({
      type: "credentials",  // this is by default, see other default params here: https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/credentials.ts
      // The credentials is used to generate a suitable form on the sign in page.
      credentials: {},
      async authorize(credentials, req) {
        return credentials as User
      },
    })
  ],
}

export default NextAuth(authOptions)
