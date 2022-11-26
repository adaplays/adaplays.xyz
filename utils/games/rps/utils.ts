import { generateKey, decrypt } from "utils/cryptography/utils";
import { Constr, Data, fromHex, hexToUtf8, Lucid, PlutusData, toHex, TxHash, utf8ToHex, UTxO, KeyHash } from "lucid-cardano"
import { getMintingPolicy } from "utils/lucid/minting-policy";
import { intToMatchResult, intToMove, matchResultToInt, moves, moveToInt, matchResultToString } from "constants/games/rps/constants";
import { Move, MatchResult, Game } from "types/games/rps/types";
import { tokenName } from 'constants/games/rps/constants'
import { getConstr } from "utils/lucid/lucid";

// Functions here assume that we are given a correct structure, call these inside try/catch if you may.

export const getGameParams = (datum: PlutusData) => getConstr(datum).fields[0]
export const getGamePlayerPC = (datum: PlutusData, forFirst: boolean) => getConstr(getConstr(getConstr(getGameParams(datum)).fields[forFirst ? 0 : 1]).fields[0]).fields[0] as string
export const getGamePlayerSC = (datum: PlutusData, forFirst: boolean) => getConstr(getConstr(getConstr(getConstr(getConstr(getGameParams(datum)).fields[forFirst ? 0 : 1]).fields[1]).fields[0]).fields[0]).fields[0] as string
export const getGameStake = (datum: PlutusData) => getConstr(getGameParams(datum)).fields[2] as bigint
export const getGameStartTime = (datum: PlutusData) => getConstr(getGameParams(datum)).fields[3] as bigint
export const getGameMoveDuration = (datum: PlutusData) => getConstr(getGameParams(datum)).fields[4] as bigint
export const getGameToken = (datum: PlutusData) => getConstr(getGameParams(datum)).fields[5]
export const getGamePolicyId = (datum: PlutusData) => getConstr(getGameToken(datum)).fields[0] as string
export const getGameTokenName = (datum: PlutusData) => getConstr(getGameToken(datum)).fields[1] as string
export const getGameTokenORef = (datum: PlutusData) => getConstr(getGameParams(datum)).fields[6]
export const getGameTxHash = (datum: PlutusData) => getConstr(getConstr(getGameTokenORef(datum)).fields[0]).fields[0] as TxHash
export const getGameTxIx = (datum: PlutusData) => getConstr(getGameTokenORef(datum)).fields[1] as bigint
export const getGamePbkdf2Iv = (datum: PlutusData) => fromHex(getConstr(getGameParams(datum)).fields[7] as string)
export const getGamePbkdf2Iter = (datum: PlutusData) => Number(getConstr(getGameParams(datum)).fields[8])
export const getGameEncryptedNonce = (datum: PlutusData) => fromHex(getConstr(getGameParams(datum)).fields[9] as string)
export const getGameEncryptIv = (datum: PlutusData) => fromHex(getConstr(getGameParams(datum)).fields[10] as string)
export const getGameMoveByteString = (datum: PlutusData) => getConstr(datum).fields[1] as string
export const getGameFirstMove = (datum: PlutusData) => hexToUtf8(getConstr(datum).fields[1] as string) as Move
export const getGameSecondMove = (datum: PlutusData) => getConstr(datum).fields[2]
export const getGameSecondMoveIndex = (datum: PlutusData) => getConstr(getGameSecondMove(datum)).index
export const getGameSecondMoveValue = (datum: PlutusData) => intToMove[getConstr(getConstr(getGameSecondMove(datum)).fields[0]).index]
export const getGameMatchResult = (datum: PlutusData) => getConstr(datum).fields[3]
export const getGameMatchResultIndex = (datum: PlutusData) => getConstr(getGameMatchResult(datum)).index
export const getGameMatchResultValue = (datum: PlutusData) => intToMatchResult[getConstr(getConstr(getGameMatchResult(datum)).fields[0]).index]

export const verifyNft = (lucid: Lucid, utxo: UTxO) => {
  const datum = Data.from(utxo.datum!);
  const gamePolicyId = getGamePolicyId(datum)
  const gameTokenName = getGameTokenName(datum)
  if (gameTokenName !== utf8ToHex(tokenName)) return false
  // nft amount is different than 1 (or not present)
  if (utxo.assets[gamePolicyId + gameTokenName] !== 1n) return false
  const txHash = getGameTxHash(datum)
  const txIx = getGameTxIx(datum)
  // txIx == undefined will also handle null case as null == undefined returns true. Note: 0 == undefined returns false
  if (!txHash || (txIx == undefined))
    return false
  const mintingPolicy = getMintingPolicy(txHash, Number(txIx), "RPS")
  const policyId = lucid.utils.mintingPolicyToId(mintingPolicy)
  if (gamePolicyId === policyId) {
    return true
  } else {
    return false
  }
}

export const getGameDetailsAndVerify = async (lucid: Lucid, utxo: UTxO, playerAddress: string, password: string): Promise<Game> => {
  if (!utxo.datum) throw "No inline datum."
  const datum = Data.from(utxo.datum!)
  if (Object.keys(utxo.assets).length !== 2) throw "Must have only two assets."
  const gameStakeAmount = getGameStake(datum)
  if (gameStakeAmount % 1000000n !== 0n) throw "Ada must be integral."
  let stakeInAda = Number(gameStakeAmount / 1000000n)
  if (utxo.assets['lovelace'] !== gameStakeAmount) throw "Stake amount doesn't match with that in datum."
  if (!verifyNft(lucid, utxo)) throw "NFT not genuine."  // even if `verifyNft` itself throws an error, we are fine
  const playerAPC = getGamePlayerPC(datum, true)
  const playerASC = getGamePlayerSC(datum, true)
  const playerBPC = getGamePlayerPC(datum, false)
  const playerBSC = getGamePlayerSC(datum, false)
  const addressA = lucid.utils.credentialToAddress({ type: "Key", hash: playerAPC as KeyHash }, { type: "Key", hash: playerASC as KeyHash })
  const addressB = lucid.utils.credentialToAddress({ type: "Key", hash: playerBPC as KeyHash }, { type: "Key", hash: playerBSC as KeyHash })
  const startDate = new Date(Number(getGameStartTime(datum)))
  const gameMoveDuration = getGameMoveDuration(datum)
  if (!(gameMoveDuration % (60n * 1000n) === 0n)) throw "Duration is not in minutes."
  if (addressA === playerAddress || addressB === playerAddress) {
    return {
      "First player's address": addressA,
      "Second player's address": addressB,
      "Game stake amount (Ada)": stakeInAda,
      "Game start time": `${startDate.toLocaleDateString()} - ${startDate.toLocaleTimeString()}`,
      "Game move duration (in minutes)": Number(gameMoveDuration / (60n * 1000n)),
      "Game unique identifier": getGamePolicyId(datum),
      // Ignoring `gTokenORef` as it's not as such relevant for end user and `verifyNft` already verifies its content
      ...(addressA === playerAddress && {"Your move": await getMove(password, datum)}),
      "Second player's move": getGameSecondMoveIndex(datum) === 1 ? "Not made." : getGameSecondMoveValue(datum),
      "Match result": getGameMatchResultIndex(datum) === 1 ? "Not determined." : matchResultToString[getGameMatchResultValue(datum)],
    }
  } else throw "Invalid."
}

export const getKey = async (password: string, datum: PlutusData) => {
  const iter = getGamePbkdf2Iter(datum)
  const iv = getGamePbkdf2Iv(datum)
  return (await generateKey(password, iter, iv)).key
}

export const getOriginalRandomString = async (password: string, datum: PlutusData) => {
  const encryptedNonce = getGameEncryptedNonce(datum)
  const encryptionIv = getGameEncryptIv(datum)
  const key = await getKey(password, datum)
  return (await decrypt(key, encryptionIv, encryptedNonce))
}

export const getMove = async (password: string, datum: PlutusData) => {
  const nonce = await getOriginalRandomString(password, datum)
  const moveByteString = getGameMoveByteString(datum)
  const encoder = new TextEncoder()
  for (let i = 0; i < moves.length; i++) {
    if (toHex(new Uint8Array(await window.crypto.subtle.digest("SHA-256", encoder.encode(nonce + moves[i])))) === moveByteString) {
      return moves[i]
    }
  }
  throw "No move found"
}

export const getMatchResult = (moveA: Move, moveB: Move): MatchResult => {
  if (moveA === moveB) return "Draw"
  else if (moveA === "Rock" && moveB === "Scissors") return "WinA"
  else if (moveA === "Paper" && moveB === "Rock") return "WinA"
  else if (moveA === "Scissors" && moveB === "Paper") return "WinA"
  else return "WinB"
}

// these (i.e., following functions) most likely modify the original datum

export const addDatumMoveB = (datum: PlutusData, move: Move) => {
  let newDatum = datum;
  (newDatum as Constr<PlutusData>).fields[2] = new Constr(0, [new Constr(moveToInt[move], [])])
  return newDatum
}

export const addDatumMoveA = (datum: PlutusData, move: Move) => {
  let newDatum = datum;
  (newDatum as Constr<PlutusData>).fields[1] = utf8ToHex(move)
  return newDatum
}

export const addDatumMatchResult = (datum: PlutusData, matchResult: MatchResult) => {
  let newDatum = datum;
  (newDatum as Constr<PlutusData>).fields[3] = new Constr(0, [new Constr(matchResultToInt[matchResult], [])])
  return newDatum
}
