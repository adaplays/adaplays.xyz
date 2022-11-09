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

// Now comes the version using web crypto api, written with help from their documentation: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey#pbkdf2_2

/*
  Get some key material to use as input to the deriveKey method.
  The key material is a password supplied by the user.
*/
const getKeyMaterial = (password: string) => {
  let enc = new TextEncoder();
  return window.crypto.subtle.importKey(
    "raw", 
    enc.encode(password),
    {name: "PBKDF2"}, 
    false, 
    ["deriveBits", "deriveKey"]
  );
}

const generateKey = async (password: string, gIter?: number, gIv?: Uint8Array) => {
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

export default generateKey
