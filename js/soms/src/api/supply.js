import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/supply',
    method: 'post',
    data
  })
}

export function del(supplyId) {
  return request({
    url: 'api/supply/' + supplyId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/supply',
    method: 'put',
    data
  })
}

export function getSupply(params) {
  return request({
    url: 'api/supply',
    method: 'get',
    params
  })
}
