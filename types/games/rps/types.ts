export type Move = "Rock" | "Paper" | "Scissors"
export type MatchResult = "WinA" | "WinB" | "Draw"

export interface Game {
  "First player's address": string,
  "Second player's address": string,
  "Game stake amount (Ada)": number,
  "Game start time": string, 
  "Game move duration (in minutes)": number,
  "Game unique identifier": string,
  "Your move"?: Move,
  "Second player's move": string | Move,
  "Match result": string | MatchResult,
}
