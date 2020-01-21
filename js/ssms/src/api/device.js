import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/device',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/device',
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: 'api/device',
    method: 'put',
    data
  })
}

export function del(data) {
  return request({
    url: 'api/device/' + data,
    method: 'delete',
    data
  })
}
export function operateDeviceStatus(data) {
  return request({
    url: 'api/operateDeviceStatus',
    method: 'post',
    data
  })
}

