import request from '@/utils/request'

export function getAllJobType() {
  const params = {
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/jobType',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/jobType',
    method: 'post',
    data
  })
}

export function del(jobType) {
  return request({
    url: 'api/jobType/' + jobType,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/jobType',
    method: 'put',
    data
  })
}
