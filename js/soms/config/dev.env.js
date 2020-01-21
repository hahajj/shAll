'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"/api/"',
  Workcode_BASE_API: '"http://192.168.18.170:88/third/sso.jsp"',
  HOST: '"dev"',
})
