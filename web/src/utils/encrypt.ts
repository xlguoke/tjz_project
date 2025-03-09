import CryptoJS from 'crypto-js'

export function encrypt(word: string) {
  const keyBase64 = 'o9szYIOq1rRMiouNhNvaq96lqUvCekxR'
  const key = CryptoJS.enc.Base64.parse(keyBase64)
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.toString()
}
