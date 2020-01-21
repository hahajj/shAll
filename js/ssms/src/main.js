import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router/routers'
import permission from './components/permission'
import store from './store'

import '@/icons' // icon
import './router/index' // permission control

import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)
import BaiduMap from 'vue-baidu-map'

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'WlrtOSjGFsF5Z6dIN4yinb2epw54qpGm'
})

const options = {
  fullscreenEl: false
}
Vue.use(preview, options)

Vue.use(mavonEditor)
Vue.use(permission)
Vue.use(ElementUI, { locale })
Vue.config.productionTip = false
require('babel-polyfill')

export const eventBus = new Vue()

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
