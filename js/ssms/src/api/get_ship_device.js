import request from '@/utils/request'

// export function getDevices(params) {
//   return request({
//     url: 'api_devices/devices',
//     method: 'get',
//     params
//   })
// }
export function getDevicesOut(params) { // 本地调取后台 后台调取外部 设备
  return request({
    url: 'api/devices',
    method: 'get'

  })
}
export function getCameraOut(params) {
  return request({
    url: 'api/devices/' + params,
    method: 'get'
  })
}

// export function getUrl(data) {
//   return request({
//     url: 'api_devs/preview1',
//     method: 'post',
//     data
//
//   })
// }
export function getUrlOut(params) {
  return request({
    url: 'api/devices/' + params,
    method: 'get'
  })
}

export function getBackOut(params) {
  return request({
    url: 'api/devices/rec',
    method: 'get',
    params
  })
}

export function getptz(params) {
  return request({
    url: 'api/devices/ptz',
    method: 'get',
    params
  })
}

// export function getLive(url) {
//   return request({
//     url: 'api_devices/devices/' + url,
//     method: 'get'
//   })
// }

export function ptz_start(data) {
  return request({
    url: 'api_devs/ptz_start',
    method: 'post',
    data

  })
}
// export function ptz_start(url, data) {
//   return request({
//     url: 'api_devices/devices/' + url,
//     method: 'put',
//     data
//   })
// }
export function ptz_start_stop(data) {
  return request({
    url: 'api_devs/ptz_start_stop',
    method: 'post',
    data

  })
}

// export function playbackV(data) {
//   return request({
//     url: 'api_devs/playback1',
//     method: 'post',
//     data
//
//   })
// }

export function changeDevicePosition(data) {
  return request({
    url: 'api_devs/send_gnss_command1',
    method: 'post',
    data

  })
}
export function ship_update1(data) {
  return request({
    url: 'api_devs/ship_update1',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/menus',
    method: 'put',
    data
  })
}
