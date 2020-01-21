import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/partyInfo',
    method: 'post',
    data
  })
}

export function del(partyInfoId) {
  return request({
    url: 'api/partyInfo/' + partyInfoId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/partyInfo',
    method: 'put',
    data
  })
}
