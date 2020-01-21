import request from '@/utils/request'

export function get() {
  return request({
    url: 'api/s2lCircular',
    method: 'get',
  })
}

export function add(data) {
  return request({
    url: 'api/s2lCircular',
    method: 'post',
    data
  })
}

export function del(circularId) {
  return request({
    url: 'api/s2lCircular/' + circularId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/s2lCircular',
    method: 'put',
    data
  })
}
