import request from '@/utils/request'
export function getShipAlarm(params) {
  return request({
    url: 'api/shipAlarm',
    method: 'get',
    params
  })
}
export function add(data) {
  return request({
    url: 'api/shipAlarm',
    method: 'post',
    data
  })
}

export function del(circularId) {
  return request({
    url: 'api/shipAlarm/' + circularId,
    method: 'delete'
  })
}

export function editShipAlarm(data) {
  return request({
    url: 'api/shipAlarm',
    method: 'put',
    data
  })
}
