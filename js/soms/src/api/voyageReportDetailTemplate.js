import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/voyageReportDetailTemplate',
    method: 'post',
    data
  })
}

export function del(circularId) {
  return request({
    url: 'api/voyageReportDetailTemplate/' + circularId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/voyageReportDetailTemplate',
    method: 'put',
    data
  })
}

