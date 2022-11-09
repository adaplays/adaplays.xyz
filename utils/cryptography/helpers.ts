
// dec2hex :: Integer -> String
// i.e. 0-255 -> '00'-'ff'
export const dec2hex = (dec: number) => {
  return dec.toString(16).padStart(2, "0")
}

// This answer tries to give optimum approach: https://stackoverflow.com/a/55200387/20330802 but we are not working with arbitrary length data here, so these optimisations are not worth it.
export const arrayBufferToHexString = (buf: ArrayBuffer) => {
  return Array.from(new Uint8Array(buf), dec2hex).join('')
}
