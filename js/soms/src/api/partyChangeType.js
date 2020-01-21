import request from '@/utils/request'

export function getAllPartyChangeType(data) {
  return request({
    url: 'api/partyChangeType/all',
    method: 'get',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/partyChangeType',
    method: 'post',
    data
  })
}

export function del(partyChangeType) {
  return request({
    url: 'api/partyChangeType/' + partyChangeType,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/partyChangeType',
    method: 'put',
    data
  })
}
