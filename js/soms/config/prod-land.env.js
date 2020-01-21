'use strict'
let HOST = process.argv.splice(2)[0] || 'prod';
module.exports = {
  NODE_ENV: '"production"',
  BASE_API: '"http://47.104.149.53:8000"',
  Workcode_BASE_API: '"http://47.104.23.194:86/third/sso.jsp"',
  HOST: '"'+HOST+'"'
}
