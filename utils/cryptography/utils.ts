import { toHex } from "lucid-cardano"

export const generateRandomString = () => {
  var arr = new Uint8Array(20)
  window.crypto.getRandomValues(arr)
  return toHex(arr)
}

// Written with help from their documentation: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey#pbkdf2_2

const getKeyMaterial = (password: string) => {
  let enc = new TextEncoder();
  return window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
}

export const generateKey = async (password: string, gIter?: number, gIv?: Uint8Array) => {
  const keyMaterial: CryptoKey = await getKeyMaterial(password)
  const addIter: Uint16Array = window.crypto.getRandomValues(new Uint16Array(1))
  const iter: number = gIter ? gIter : 2048_000 + addIter[0]
  const iv: Uint8Array = gIv ? gIv : window.crypto.getRandomValues(new Uint8Array(24))
  const key: CryptoKey = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      hash: "SHA-512",
      salt: iv,
      iterations: iter
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  )
  return { iv, iter, key }
}

export const encrypt = async (message: string, key: CryptoKey, gIv?: Uint8Array) => {
  let enc = new TextEncoder();
  const iv: Uint8Array = gIv ? gIv : window.crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(message)
  )
  return { iv, encrypted }
}

export const decrypt = async (key: CryptoKey, iv: Uint8Array, encrypted: ArrayBuffer) => {
  let decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv
    },
    key,
    encrypted
  )
  let dec = new TextDecoder()
  return dec.decode(decrypted)
}

// Initially wrote this but it turns out, lucid already has this.
// type Hex = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f'
//
// const hexString: Hex[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
//
// const mapHex: Record<Hex, number> = {
//   0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6,
//   7: 7, 8: 8, 9: 9, a: 10, b: 11, c: 12, d: 13,
//   e: 14, f: 15
// };
//
// export const toHex = (uint8: Uint8Array) => {
//   return Array.from(uint8)
//     .map((a) => hexString[a >> 4] + hexString[a & 15])
//     .join("");
// }
//
// export const fromHex = (givenHexString: string) => {
//   const arr = new Uint8Array(Math.floor((givenHexString || "").length / 2));
//   for (let i = 0; i < arr.length; i++) {
//     const a = mapHex[givenHexString[2 * i] as Hex];
//     const b = mapHex[givenHexString[2 * i + 1] as Hex];
//     arr[i] = (a << 4) | b;
//   }
//   return arr
// }
//
// Following is the nodejs code I wrote initially:
//
// import crypto from 'crypto'
//
// const GenerateKey = (password: string, gIter?: number, gIv?: Buffer) => {
//   const addIter: number = crypto.randomInt(0, 200_000)
//   const iter: number = gIter ? gIter : 2048_000 + addIter
//   const iv: Buffer = crypto.randomBytes(24)
//   const key: Buffer = crypto.pbkdf2Sync(password, iv, iter, 32, 'sha512')
//   return { iv, iter, key }
// }
//
// export default GenerateKey
//

// import crypto from 'crypto'
//
// const Encrypt = (message: string, key: Buffer, gIv?: Buffer) => {
//   const iv: Buffer = gIv ? gIv : crypto.randomBytes(12)
//   const algorithm: crypto.CipherCCMTypes = 'chacha20-poly1305'  // https://stackoverflow.com/a/52097838/20330802 https://nodejs.org/api/crypto.html#ccm-mode (also has a sample example)
//   const cipher = crypto.createCipheriv(algorithm, key, iv, { authTagLength: 16 })
//   // cipher.setAAD(associatedData)  // if you want to add
//   const encrypted: Buffer = cipher.update(message, 'utf8')
//   cipher.final()
//   const authTag: Buffer = cipher.getAuthTag()
//   return { iv, encrypted, authTag }
// }
//
// export default Encrypt
//
// import crypto from 'crypto'
//
// const Decrypt = (key: Buffer, iv: Buffer, encrypted: Buffer, authTag: Buffer) => {
//   const algorithm: crypto.CipherCCMTypes = 'chacha20-poly1305'
//   const decipher = crypto.createDecipheriv(algorithm, key, iv, { authTagLength: 16 })
//   decipher.setAuthTag(authTag)
//   const message = decipher.update(encrypted, undefined, 'utf8')
//   decipher.final()
//   return message
// }
//
// export default Decrypt
