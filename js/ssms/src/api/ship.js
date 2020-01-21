import request from '@/utils/request'

export function getShip(params) {
  return request({
    url: 'api/ship',
    method: 'get',
    params
  })
}
export function getFence(params) {
  return request({
    url: 'api/fence',
    method: 'get',
    params
  })
}
export function addFence(data) {
  return request({
    url: 'api/fence',
    method: 'post',
    data
  })
}

export function updateFence(data) {
  return request({
    url: 'api/fence',
    method: 'put',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/ship',
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: 'api/ship',
    method: 'put',
    data
  })
}

export function del(data) {
  return request({
    url: 'api/ship/' + data,
    method: 'delete',
    data
  })
}
export function updateShipDevice(data) {
  return request({
    url: 'api/updateShipDevice',
    method: 'post',
    data
  })
}
export function operateShipStatus(data) {
  return request({
    url: 'api/operateShipStatus',
    method: 'post',
    data
  })
}

