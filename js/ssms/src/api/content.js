import request from '@/utils/request'

export function uploadPartyContents(data) {
  return request({
    url: 'api/uploadPartyContents',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/content',
    method: 'post',
    data
  })
}

export function contentPreview(contentId) {
  return request({
    url: 'api/contentPreview/' + contentId,
    method: 'get',
    responseType: 'blob',
    async: false
  })
}

export function del(contentId) {
  return request({
    url: 'api/content/' + contentId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/content',
    method: 'put',
    data
  })
}
