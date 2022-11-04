// Following is the nodejs code I wrote initially:
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

const Encrypt = async (message: string, key: CryptoKey, gIv?: Uint8Array) => {
  let enc = new TextEncoder();
  const iv: Uint8Array = gIv ? gIv : window.crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(message)
  )
  return { iv, encrypted }
}

export default Encrypt
