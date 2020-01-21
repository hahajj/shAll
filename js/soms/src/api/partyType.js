import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/partyType',
    method: 'post',
    data
  })
}

export function del(partyType) {
  return request({
    url: 'api/partyType/' + partyType,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/partyType',
    method: 'put',
    data
  })
}
