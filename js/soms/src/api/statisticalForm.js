import request from '@/utils/request'

export function getHr(params) {
  return request({
    url: 'api/hr',
    method: 'get',
    params
  })
}
