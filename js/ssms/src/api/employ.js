import request from '@/utils/request'
import { postFile } from '@/utils/request'

// findById
export function getPartyEntryByPartyId(partyId) {
  return request({
    url: 'employ/getPartyEntry?partyId=' + partyId,
    method: 'get'
  })
}
// findById
export function getPartyInfoByPartyId(partyId) {
  return request({
    url: 'employ/getPartyInfo?partyId=' + partyId,
    method: 'get'
  })
}
export function addPartyInfo(data) {
  return request({
    url: 'employ/partyInfo',
    method: 'post',
    data
  })
}
export function editPartyInfo(data) {
  return request({
    url: 'employ/partyInfo',
    method: 'put',
    data
  })
}
export function addPartyEntry(data) {
  return request({
    url: 'employ/partyEntry',
    method: 'post',
    data
  })
}
export function editPartyEntry(data) {
  return request({
    url: 'employ/partyEntry',
    method: 'put',
    data
  })
}
export function getAllJob() {
  const params = {
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/job',
    method: 'get',
    params
  })
}

export function uploadFile(data) {
  var form = new FormData()
  form.append('file', data)
  postFile('file/file', form)
}

export function uploadFileUrl(data,url) {
  var form = new FormData()
  form.append('file', data)
  return postFile(url, form)
}

export function downloadFile(data) {
  return request({
    url: 'file/download',
    method: 'post',
    data
  })
}
