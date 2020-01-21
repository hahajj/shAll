import request from '@/utils/request'

export function getCircularType() {
  const params = {
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/circularType',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/circularType',
    method: 'post',
    data
  })
}

export function del(circularType) {
  return request({
    url: 'api/circularType/' + circularType,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/circularType',
    method: 'put',
    data
  })
}
