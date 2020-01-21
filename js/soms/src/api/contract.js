import request from '@/utils/request'

export function addContract(data) {
  return request({
    url: 'api/contract',
    method: 'post',
    data
  })
}
export function editContract(data) {
  return request({
    url: 'api/contract',
    method: 'put',
    data
  })
}

export function del(supplyId) {
  return request({
    url: 'api/contract/' + supplyId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/contract',
    method: 'put',
    data
  })
}

export function getContract(params) {
  return request({
    url: 'api/contract',
    method: 'get',
    params
  })
}

export function commitAudit(data) {
  return request({
    url: 'api/commitContractPublish/' + data,
    method: 'post'
  })
}

