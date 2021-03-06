import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/s2lShipCertificate',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/s2lShipCertificate/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/s2lShipCertificate',
    method: 'put',
    data
  })
}
export function getShipData(params) {
  return request({
    url: 'api/s2lShipCertificate',
    method: 'get',
    params
  })
}

export function getS2lShipCertificator() {
  return request({
    url: 'api/s2lShipCertificator',
    method: 'get',
  })
}

