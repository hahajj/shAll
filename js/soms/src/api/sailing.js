import request from '@/utils/request'

export function getSailing(params) {
  return request({
    url: 'api/sailing',
    method: 'get',
    params
  })
}
export function add(data) {
  return request({
    url: 'api/sailing',
    method: 'post',
    data
  })
}

export function del(circularId) {
  return request({
    url: 'api/sailing/' + circularId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/sailing',
    method: 'put',
    data
  })
}
