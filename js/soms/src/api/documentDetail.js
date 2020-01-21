import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/documentDetail',
    method: 'post',
    data
  })
}

export function del(documentDetailId) {
  return request({
    url: 'api/documentDetail/' + documentDetailId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/documentDetail',
    method: 'put',
    data
  })
}

export function get(params) {
  return request({
    url: 'api/documentDetail',
    method: 'get',
    params
  })
}

export function documentDetailexcel(data) {
  return request({
    url: 'api/documentDetailexcel',
    method: 'post',
    data
  })
}
