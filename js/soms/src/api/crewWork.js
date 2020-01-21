import request from '@/utils/request'

// 获取所有的船员工作信息
export function getCrewWork(params) {
  return request({
    url: 'api/crewWork',
    method: 'get',
    params
  })
}

// 获取所有的船员工作信息
export function getCrewWorkGroupByParty(params) {
  return request({
    url: 'api/crewWorkGroupByParty',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/crewWork',
    method: 'post',
    data
  })
}

export function del(partyWorkId) {
  return request({
    url: 'api/crewWork/' + partyWorkId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/crewWork',
    method: 'put',
    data
  })
}
