import request from '@/utils/request'

export function getQueryReportType() { // 动态类型
  return request({
    url: 'api/queryReportType',
    method: 'get'
  })
}

export function getQueryLabelByReportType(params) { // 标签
  return request({
    url: 'api/queryLabelByReportType',
    method: 'get',
    params
  })
}
export function getS2lVoyageReport(params) {
  return request({
    url: 'api/voyageReportDetailTemplate',
    method: 'get',
    params
  })
}

export function get() {
  return request({
    url: 'api/s2lVoyageReportDetailTemplate',
    method: 'get'
  })
}
export function add(data) {
  return request({
    url: 'api/s2lVoyageReportDetailTemplate',
    method: 'post',
    data
  })
}

export function del(circularId) {
  return request({
    url: 'api/s2lVoyageReportDetailTemplate/' + circularId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/s2lVoyageReportDetailTemplate',
    method: 'put',
    data
  })
}

export function checkReportIsEndByVoyageId(params) { // 校验可否添加
  return request({
    url: 'api/checkReportIsEndByVoyageId',
    method: 'get',
    params
  })
}
export function addS2lVoyageReport(data) { // 新增动态报
  return request({
    url: 'api/s2lVoyageReport',
    method: 'post',
    data
  })
}
export function delS2lVoyageReport(circularId) { // 删除动态报
  return request({
    url: 'api/s2lVoyageReport/' + circularId,
    method: 'delete'
  })
}
export function queryLastedNoonOil(params) { // 上次油量
  return request({
    url: 'api/queryLastedNoonOil',
    method: 'get',
    params
  })
}
export function queryVoyageOil(params) { // 上次油量
  return request({
    url: 'api/queryVoyageOil',
    method: 'get',
    params
  })
}

export function queryVolumeError(params) { // 上次油量
  return request({
    url: 'api/queryVolumeError',
    method: 'get',
    params
  })
}

export function getS2lVoyageReportDetail(params) { // 获取该航次内容
  return request({
    url: 'api/s2lVoyageReportDetail',
    method: 'get',
    params
  })
}
export function updateS2lVoyageReport(data) { // 更新航次
  return request({
    url: 'api/s2lVoyageReport',
    method: 'put',
    data
  })
}
export function commitLand(data) { // 提交岸基
  return request({
    url: 'api/commitLand',
    method: 'post',
    data
  })
}
export function landAudit(data) {//岸基审批
  return request({
    url: 'api/landAudit',
    method: 'post',
    data
  })
}
export function queryTheLastReportTimePoint(data) { // 获取上个时间点
  return request({
    url: 'api/queryTheLastReportTimePoint',
    method: 'post',
    data
  })
}

