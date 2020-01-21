import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/s2lPartyChangeConfirm',
    method: 'post',
    data
  })
}

export function del(partyChangeId) {
  return request({
    url: 'api/s2lPartyChangeConfirm/' + partyChangeId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/s2lPartyChangeConfirm',
    method: 'put',
    data
  })
}
