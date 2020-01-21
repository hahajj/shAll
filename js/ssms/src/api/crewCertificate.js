import request from '@/utils/request'

// 获取所有的Party
export function getAllCrewCertificate() {
  return request({
    url: 'api/crewCertificate',
    method: 'get'
  })
}

export function addCrewCertificate(data) {
  return request({
    url: 'api/uploadCrewCertificate',
    method: 'post',
    processData: false,
    data
  })
}

export function delCrewCertificate(crewCertificateId) {
  return request({
    url: 'api/crewCertificate/' + crewCertificateId,
    method: 'delete'
  })
}

export function editCrewCertificate(data) {
  return request({
    url: 'api/crewCertificate',
    method: 'put',
    data
  })
}

export function getCrewCertificateByPartyId(partyId) {
  return request({
    url: 'api/crewCertificateContents/' + partyId,
    method: 'get'
  })
}
