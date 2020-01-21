import request from '@/utils/request'

export function getPartyContentType() {
  const params = {
    parent: 'PARTY',
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/contentType',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/contentType',
    method: 'post',
    data
  })
}

export function del(contentType) {
  return request({
    url: 'api/contentType/' + contentType,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/contentType',
    method: 'put',
    data
  })
}
