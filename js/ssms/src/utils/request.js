import axios from 'axios'
import router from '@/router/routers'
import { Notification, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import Config from '@/config'
// import CryptoJS_HmacSHA1 from '@/utils/hmac-sha1'
import { hmac_sha1, b64encode } from '@/utils/hmac'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: Config.timeout // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    if (config.url.indexOf('api_devices/') > -1) {
      const httpMethods = config.method === 'get' ? 'GET' : 'PUT'
      const uri = config.url.replace('api_devices', '')
      const secret = 'z5j6o6rwv7565jn950hvoopb1y1d3p2i'
      const key = 'ir5n5hozzta6mjco'
      var timestamp = ''
      var value = httpMethods + '\n' + timestamp + '\n' + uri
      console.log(value)
      var signature = b64encode(hmac_sha1(value, secret))
      config.headers['Content-Type'] = 'application/json'
      config.headers['Authorization'] = 'JAS ' + key + ':' + signature
    }
    if (config.url.indexOf('api_devs/') > -1) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const code = response.status
    if (code < 200 || code > 300) {
      Notification.error({
        title: response.message
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    let code = 0
    try {
      code = error.response.data.status
    } catch (e) {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        Notification.error({
          title: '网络请求超时',
          duration: 2500
        })
        return Promise.reject(error)
      }
      if (error.toString().indexOf('Error: Network Error') !== -1) {
        Notification.error({
          title: '网络请求错误',
          duration: 2500
        })
        return Promise.reject(error)
      }
    }
    if (code === 401) {
      MessageBox.confirm(
        '登录状态已过期，您可以继续留在该页面，或者重新登录',
        '系统提示',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    } else if (code === 403) {
      router.push({ path: '/401' })
    } else {
      console.log(error)
      const errorMsg = error.response.data.message
      if (errorMsg !== undefined) {
        Notification.error({
          title: errorMsg,
          duration: 2500
        })
      }
    }
    return Promise.reject(error)
  }
)

export function get(url, params = {}) {
  params.t = new Date().getTime()
  return service({
    url: url,
    method: 'get',
    headers: {
    },
    params
  })
}

export function post(url, data = {}) {
  const sendObject = {
    url: url,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  }
  sendObject.data = JSON.stringify(data)
  return service(sendObject)
}

export function postFile(url, data) {
  const sendObject = {
    url: url,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: data
  }
  return service(sendObject)
}

export default service
