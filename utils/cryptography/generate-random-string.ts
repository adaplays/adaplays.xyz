// Taken from: https://stackoverflow.com/a/27747377/20330802
import {dec2hex} from 'utils/cryptography/helpers'

export const generateRandomString = () => {
  var arr = new Uint8Array(20)
  window.crypto.getRandomValues(arr)
  return Array.from(arr, dec2hex).join('')
}
