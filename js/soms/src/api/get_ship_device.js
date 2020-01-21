import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api_devices/devices',
    method: 'get',
    params
  })
}

export function getLive(url) {
  return request({
    url: 'api_devices/devices/' + url,
    method: 'get'
  })
}

export function ptz_start(data) {
  return request({
    url: 'api_devs/ptz_start',
    method: 'post',
    data

  })
}

export function ptz_start_stop(data) {
  return request({
    url: 'api_devs/ptz_start_stop',
    method: 'post',
    data

  })
}

export function playbackV(data) {
  return request({
    url: 'api_devs/playback1',
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
// export function edit(data) {
//   return request({
//     url: 'api/menus',
//     method: 'put',
//     data
//   })
// }
