import request from '@/utils/request'

export function getOrganization(params) {
  // params.page = 0
  // params.size = 9999
  return request({
    url: 'api/organization',
    method: 'get',
    params
  })
}

export function getOrganizationByCriteria(params) {
  return request({
    url: 'api/organizationNopageByCriteria',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/organization',
    method: 'post',
    data
  })
}

export function del(organizationId) {
  return request({
    url: 'api/organization/' + organizationId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/organization',
    method: 'put',
    data
  })
}

