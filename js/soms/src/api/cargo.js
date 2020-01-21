import request from '@/utils/request'

export function get() {
  return request({
    url: 'api/cargo',
    method: 'get'
  })
}
export function add(data) {
  return request({
    url: 'api/cargo',
    method: 'post',
    data
  })
}

export function del(circularId) {
  return request({
    url: 'api/cargo/' + circularId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/cargo',
    method: 'put',
    data
  })
}

export function getContractCargoInfo() {
  return request({
    url: 'api/contractCargoInfo',
    method: 'get'
  })
}
