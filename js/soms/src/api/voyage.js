import request from '@/utils/request'

export function getVoyage(params) {
  return request({
    url: 'api/voyage',
    method: 'get',
    params
  })
}
export function add(data) {
  return request({
    url: 'api/voyage',
    method: 'post',
    data
  })
}

export function del(circularId) {
  return request({
    url: 'api/voyage/' + circularId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/voyage',
    method: 'put',
    data
  })
}

export function commitVoyagePublish(id) {
  return request({
    url: 'api/commitVoyagePublish/' + id,
    method: 'post',
  })
}

export function confirmVoyage(id) {
  return request({
    url: 'api/confirmVoyage/' + id,
    method: 'post',
  })
}

