import request from '@/utils/request'

export function commitEntryAudit(partyEntryAuditId) {
  return request({
    url: 'api/commitEntryAudit/' + partyEntryAuditId,
    method: 'post'
  })
}

export function add(data) {
  return request({
    url: 'api/partyEntryAudit',
    method: 'post',
    data
  })
}

export function del(partyEntryId) {
  return request({
    url: 'api/partyEntryAudit/' + partyEntryId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/partyEntryAudit',
    method: 'put',
    data
  })
}
// export function commitEntryAudit(id,data) {
//   return request({
//     url: 'api/commitEntryAudit/'+id,
//     method: 'post',
//     data
//   })
// }

export function getOAUserSecertMessage(data) {
  return request({
    url: 'api/getOAUserSecertMessage',
    method: 'post',
    data
  })
}

