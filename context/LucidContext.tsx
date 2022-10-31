import { createContext } from "react"
import type { ILucidContext } from "../types/types"


export const LucidContext = createContext<ILucidContext | null>(null)
