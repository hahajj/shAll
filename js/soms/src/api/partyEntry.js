import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/partyEntry',
    method: 'post',
    data
  })
}

export function del(partyEntryId) {
  return request({
    url: 'api/partyEntry/' + partyEntryId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/partyEntry',
    method: 'put',
    data
  })
}
