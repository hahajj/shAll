import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/circular',
    method: 'post',
    data
  })
}

export function del(circularId) {
  return request({
    url: 'api/circular/' + circularId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/circular',
    method: 'put',
    data
  })
}
