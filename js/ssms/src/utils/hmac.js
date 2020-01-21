import cryptoJs from 'crypto-js'

export function hmac_sha1(text, secret) {
  // return cryptoJs.createHmac(algorithm, secret).update(text).digest('hex')
  return cryptoJs.HmacSHA1(text, secret)
}
export function b64encode(text) {
  // var wordArray = cryptoJs.enc.Utf8.parse(text)
  return cryptoJs.enc.Base64.stringify(text)
}
export function b64decode(text) {
  var parsedWordArray = cryptoJs.enc.Base64.parse(text)
  return parsedWordArray.toString(cryptoJs.enc.Utf8)
}

