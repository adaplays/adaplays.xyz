import { generateKey, decrypt } from "utils/cryptography/utils";
import { Constr, Data, fromHex, Lucid, PlutusData, toHex, TxHash, utf8ToHex, UTxO } from "lucid-cardano"
import { getMintingPolicy } from "utils/lucid/minting-policy";
import { intToMove, moves, moveToInt } from "constants/games/rps/constants";
import { Move } from "types/games/rps/types";

// Functions here assume that we are given a correct structure, call these inside try/catch if you may.

export const getGameParams = (datum: PlutusData) => (datum as Constr<PlutusData>).fields[0]
export const getGameStake = (datum: PlutusData) => (getGameParams(datum) as Constr<PlutusData>).fields[2] as bigint
export const getGameStartTime = (datum: PlutusData) => (getGameParams(datum) as Constr<PlutusData>).fields[3] as bigint
export const getGameMoveDuration = (datum: PlutusData) => (getGameParams(datum) as Constr<PlutusData>).fields[4] as bigint
export const getGameToken = (datum: PlutusData) => (getGameParams(datum) as Constr<PlutusData>).fields[5]
export const getGamePolicyId = (datum: PlutusData) => (getGameToken(datum) as Constr<PlutusData>).fields[0] as string
export const getGameTokenName = (datum: PlutusData) => (getGameToken(datum) as Constr<PlutusData>).fields[1] as string
export const getGameTokenORef = (datum: PlutusData) => (getGameParams(datum) as Constr<PlutusData>).fields[6]
export const getGameTxHash = (datum: PlutusData) => ((getGameTokenORef(datum) as Constr<PlutusData>).fields[0] as Constr<PlutusData>).fields[0] as TxHash
export const getGameTxIx = (datum: PlutusData) => (getGameTokenORef(datum) as Constr<PlutusData>).fields[1] as bigint
export const getGamePbkdf2Iv = (datum: PlutusData) => fromHex((getGameParams(datum) as Constr<PlutusData>).fields[7] as string)
export const getGamePbkdf2Iter = (datum: PlutusData) => Number((getGameParams(datum) as Constr<PlutusData>).fields[8])
export const getGameEncryptedNonce = (datum: PlutusData) => fromHex((getGameParams(datum) as Constr<PlutusData>).fields[9] as string)
export const getGameEncryptIv = (datum: PlutusData) => fromHex((getGameParams(datum) as Constr<PlutusData>).fields[10] as string)
export const getGameMoveByteString = (datum: PlutusData) => (datum as Constr<PlutusData>).fields[1] as string
export const getGameSecondMove = (datum: PlutusData) => (datum as Constr<PlutusData>).fields[2]
export const getGameSecondMoveIndex = (datum: PlutusData) => (getGameSecondMove(datum) as Constr<PlutusData>).index
export const getGameSecondMoveValue = (datum: PlutusData) => intToMove[((getGameSecondMove(datum) as Constr<PlutusData>).fields[0] as Constr<PlutusData>).index]
export const getGameMatchResult = (datum: PlutusData) => (datum as Constr<PlutusData>).fields[3]
export const getGameMatchResultIndex = (datum: PlutusData) => (getGameMatchResult(datum) as Constr<PlutusData>).index

export const verifyNft = (lucid: Lucid, utxo: UTxO, tokenName: string) => {
  const datum = Data.from(utxo.datum!);
  const gamePolicyId = getGamePolicyId(datum)
  // nft amount is different than 1 (or not present)
  if (utxo.assets[gamePolicyId + utf8ToHex(tokenName)] !== 1n)
    return false
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

// these most likely modify the original datum
export const addDatumMoveB = (datum: PlutusData, move: Move) => {
  let newDatum = datum;
  (newDatum as Constr<PlutusData>).fields[2] = new Constr(0, [new Constr(moveToInt[move], [])])
  return newDatum
}
