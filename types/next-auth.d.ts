import { WalletApi } from "lucid-cardano"
import NextAuth from "next-auth"
import { SupportedWallets } from "./types"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User
  }

  interface User {
    id: string,  // same as wallet address
    password: string,
    wallet: SupportedWallets,
  }
}
