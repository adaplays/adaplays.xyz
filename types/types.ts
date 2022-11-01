import { Dispatch, SetStateAction } from "react";
import { Lucid } from 'lucid-cardano'

export type SupportedWallets = "nami" | "eternl";

export interface ILucidContext {
  lucid: Lucid | null,
  setLucid: Dispatch<SetStateAction<Lucid | null>>,
}

export interface jwtUser {
  id: string,  // same as wallet address
  password: string
}
