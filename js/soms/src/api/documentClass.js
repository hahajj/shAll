import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/documentClass',
    method: 'post',
    data
  })
}

export function del(DOCUMENTClassId) {
  return request({
    url: 'api/documentClass/' + DOCUMENTClassId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/documentClass',
    method: 'put',
    data
  })
}
export function getData(params) {
  return request({
    url: 'api/documentClass',
    method: 'get',
    params
  })
}

export function getTree(params) {
  return request({
    url: 'api/documentClassTree',
    method: 'get',
    params
  })
}

