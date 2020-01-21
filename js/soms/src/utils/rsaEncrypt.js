import JSEncrypt from 'jsencrypt/bin/jsencrypt'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

// const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANL378k3RiZHWx5AfJqdH9xRNBmD9wGD\n' +
//   '2iRe41HdTNF8RUhNnHit5NpMNtGL0NPTSSpPjjI1kJfVorRvaQerUgkCAwEAAQ=='

// const privateKey = 'MIIBUwIBADANBgkqhkiG9w0BAQEFAASCAT0wggE5AgEAAkEA0vfvyTdGJkdbHkB8\n' +
//   'mp0f3FE0GYP3AYPaJF7jUd1M0XxFSE2ceK3k2kw20YvQ09NJKk+OMjWQl9WitG9p\n' +
//   'B6tSCQIDAQABAkA2SimBrWC2/wvauBuYqjCFwLvYiRYqZKThUS3MZlebXJiLB+Ue\n' +
//   '/gUifAAKIg1avttUZsHBHrop4qfJCwAI0+YRAiEA+W3NK/RaXtnRqmoUUkb59zsZ\n' +
//   'UBLpvZgQPfj1MhyHDz0CIQDYhsAhPJ3mgS64NbUZmGWuuNKp5coY2GIj/zYDMJp6\n' +
//   'vQIgUueLFXv/eZ1ekgz2Oi67MNCk5jeTF2BurZqNLR3MSmUCIFT3Q6uHMtsB9Eha\n' +
//   '4u7hS31tj1UWE+D+ADzp59MGnoftAiBeHT7gDMuqeJHPL4b+kC+gzV4FGTfhR9q3\n' +
//   'tTbklZkD2A=='

const publicKey = '-----BEGIN PUBLIC KEY-----\n' +
'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDK/IgU9zCo0yl7WYqWH3TFWGUz' +
'iu3wBSTWUpmetJZBIRkPoVagji9EYl+5hKgzMinecZNgctXr0LTImrMkmblpeu6V' +
'QoohcSWg7c5Op1fejpJ+iEAquZeYPYUDmsVOx3WREX9uhxwJNHviJYrdN24C5e4j' +
'kmKIyAgdWziWbkeuQwIDAQAB' +
'-----END PUBLIC KEY-----\n'

const privateKey = '-----BEGIN PRIVATE KEY-----\n' +
'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMr8iBT3MKjTKXtZ' +
'ipYfdMVYZTOK7fAFJNZSmZ60lkEhGQ+hVqCOL0RiX7mEqDMyKd5xk2By1evQtMia' +
'sySZuWl67pVCiiFxJaDtzk6nV96Okn6IQCq5l5g9hQOaxU7HdZERf26HHAk0e+Il' +
'it03bgLl7iOSYojICB1bOJZuR65DAgMBAAECgYAYhWs3BSmGq4OuWAHK4t/rWyNW' +
'l6jovuZVUcMnDe+8zG/HmJjramHBZBTmR2U+UggGzDeehiDbjOnZ9f5AJKXmJg/2' +
'bORkTpskYwRWPg4N3P1DTlrYtF6l2QDRwlzLBAAV4gVKGAaHFk4zlYMoeMl/aco1' +
'tiLrpmaoCH1eYX++sQJBAOoyT+fhQHenw6zDao045U87jBvSUlPdO566EKpA5A5L' +
'tDNNwC6Q/fBhoJdk+ExSG2Hklp/kQQfG4+gC6tKVcbsCQQDd4mDw5W/M6zkdMQGU' +
'TqOGT9sfPUaGaGJjJQLPc9lRO+jksBvrrotzAxM6T3poN0k5a1EdizBk9jlyAA/z' +
'EAkZAkBBuyFGOah4bPO0l5xeSqvBkzr9zAgjVaKYKCzpPBFGGeVXyOi5qSQ8xYnn' +
'NAWklh7tWNUVx2ChKCdrRPZXaG5lAkEAiucD7uqDAdKjb43VQkW0gwmM0FKoys2g' +
'AhcSWlJY0kzh7//7iqA7NiXPrKpCo+kwUtzG6+rNwfaOYbp+QZhhSQJBAKe/JYjo' +
'JUT7hetf+PKFmHOk1L+i8WHg/y1vGjv6hVkuO3TuefYT04hc1vswynqHfuEk8LCd' +
'kTZii35Hwr4kzkg=' +
'-----END PRIVATE KEY-----\n'
// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey)
  return encryptor.decrypt(txt)
}

