import request from '@/utils/request'

// 获取所有的菜单树
export function auditMessage(params) {
  return request({
    url: 'api/auditMessage',
    method: 'get',
    params
  })
}

export function auditMessageCount(params) {
  return request({
    url: 'api/auditMessageCount',
    method: 'get',
    params
  })
}

export function updateAuditMessageDealStatus(data) {
  return request({
    url: 'api/updateAuditMessageDealStatus/'+data,
    method: 'post',
    data
  })
}

