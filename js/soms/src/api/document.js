import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/document',
    method: 'post',
    data
  })
}

export function del(documentId) {
  return request({
    url: 'api/document/' + documentId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/document',
    method: 'put',
    data
  })
}
export function get(params) {
  return request({
    url: 'api/document',
    method: 'get',
    params
  })
}
export function DocumentExcel(data) {
  return request({
    url: 'api/DocumentExcel',
    method: 'post',
    data
  })
}

