import request from '@/utils/request'

export function getPort(params) {
  return request({
    url: 'api/port',
    method: 'get',
    params
  })
}
export function add(data) {
  return request({
    url: 'api/port',
    method: 'post',
    data
  })
}

export function del(circularId) {
  return request({
    url: 'api/port/' + circularId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/port',
    method: 'put',
    data
  })
}
