import request from '@/utils/request'

export function getShipType() {
  return request({
    url: 'api/shipType',
    method: 'get'
  })
}
