import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/customer',
    method: 'post',
    data
  })
}

export function del(supplyId) {
  return request({
    url: 'api/customer/' + supplyId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/customer',
    method: 'put',
    data
  })
}

export function getCustomer(params) {
  return request({
    url: 'api/customer',
    method: 'get',
    params
  })
}
