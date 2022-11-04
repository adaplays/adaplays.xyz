// Following is the nodejs code I wrote initially:
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
//

const Decrypt = async (key: CryptoKey, iv: Uint8Array, encrypted: ArrayBuffer) => {
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

export default Decrypt
