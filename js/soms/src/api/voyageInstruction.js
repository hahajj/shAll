import request from '@/utils/request'

export function get() {
  return request({
    url: 'api/voyage',
    method: 'get'
  })
}
export function add(data) {
  return request({
    url: 'api/voyage',
    method: 'post',
    data
  })
}

export function del(circularId) {
  return request({
    url: 'api/voyage/' + circularId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/voyage',
    method: 'put',
    data
  })
}
