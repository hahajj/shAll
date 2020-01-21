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

export function commitChangeAudit(partyEntryAuditId) {
  return request({
    url: 'api/commitChangeAudit/' + partyEntryAuditId,
    method: 'post'
  })
}

export function deleteRequest(data) {
  return request({
    url: 'api/deleteRequest',
    method: 'post',
    data
  })
}

export function getPartyChange(params) {
  return request({
    url: 'api/partyChangeNoPage',
    method: 'get',
    params
  })
}

