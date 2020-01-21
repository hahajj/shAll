import request from '@/utils/request'

export function getAllCircular(data) {
  return request({
    url: 'api/systemDocument',
    method: 'get',
    data
  })
}
export function downloadCircular(params) {
  console.log(params)
  return request({
    url: 'api/downloadCircular',
    method: 'get',
    responseType: 'blob',
    params
  })
}

export function downloadExcel(params) {
  console.log(params)
  return request({
    url: 'excel/getExcel',
    method: 'get',
    responseType: 'blob',
    params
  })
}

