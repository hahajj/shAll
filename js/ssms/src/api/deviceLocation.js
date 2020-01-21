import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/deviceLocation',
    method: 'get',
    params
  })
}
