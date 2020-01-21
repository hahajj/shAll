import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/partyChange',
    method: 'post',
    data
  })
}

export function del(partyChangeId) {
  return request({
    url: 'api/partyChange/' + partyChangeId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/partyChange',
    method: 'put',
    data
  })
}
