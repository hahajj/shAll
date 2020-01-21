import request from '@/utils/request'

export function getContentsByPartyId(partyId) {
  return request({
    url: 'api/partyContents/' + partyId,
    method: 'get'
  })
}
// 获取所有的Party
export function getAllParty() {
  return request({
    url: 'api/party',
    method: 'get'
  })
}

// 无分页Party
export function getAllPartyNopage(params) {
  return request({
    url: 'api/partyNopage',
    method: 'get',
    params
  })
}

// 无分页Party
export function getPartysByNameOrCode(nameOrCode) {
  return request({
    url: 'api/getPartysByNameOrCode?nameOrCode=' + nameOrCode,
    method: 'get'
  })
}

// findById
export function getPartyByPartyId(partyId) {
  return request({
    url: 'api/party/' + partyId,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/party',
    method: 'post',
    data
  })
}

export function del(partyId) {
  return request({
    url: 'api/party/' + partyId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/party',
    method: 'put',
    data
  })
}

export function exportCrew(para) {
  return request({
    url: 'excel/exportCrew/'+para,
    method: 'post'
  })
}

export function exportCrewRegister(para) {
  return request({
    url: 'excel/exportCrewRegister/'+para,
    method: 'post',
  })
}
