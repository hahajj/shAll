import request from '@/utils/request'

// 申请单新增
export function add(data) {
  return request({
    url: 'api/s2lMaterialPurchase',
    method: 'post',
    data
  })
}

// 申请单删除
export function del(materialPurchaseId) {
  return request({
    url: 'api/s2lMaterialPurchase/' + materialPurchaseId,
    method: 'delete'
  })
}

// 申请单编辑
export function edit(data) {
  return request({
    url: 'api/s2lMaterialPurchase',
    method: 'put',
    data
  })
}

// 申请单--重复申请
export function repeatApply(materialPurchaseId) {
  return request({
    url: 'api/repeatApplyMaterial/' + materialPurchaseId,
    method: 'post'
  })
}
// 单内信息新增
export function addDetial(data) {
  return request({
    url: 'api/uploadS2lMaterialPurchaseDetail',
    method: 'post',
    data
  })
}

// 单内信息删除
export function delDetial(materialPurchaseId) {
  return request({
    url: 'api/s2lMaterialPurchaseDetail/' + materialPurchaseId,
    method: 'delete'
  })
}

// 单内信息编辑
export function editDetial(data) {
  return request({
    url: 'api/s2lMaterialPurchaseDetail',
    method: 'put',
    data
  })
}

// 获取全部物资规格
export function get(params) {
  return request({
    url: 'api/materialSpec',
    method: 'get',
    params
  })
}
// 物资导出
export function getAll(params) {
  return request({
    url: 'api/exportS2lMaterialPurchases',
    method: 'get',
    params
  })
}
// 获取物资树形图
export function getMaterial(params) {
  return request({
    url: 'api/material',
    method: 'get',
    params
  })
}

// 查询物资
export function getmaterialPart(params) {
  return request({
    url: 'api/materialSpec',
    method: 'get',
    params
  })
}

// 查询物资库存
export function getMaterialInventory(params) {
  return request({
    url: 'api/s2lMaterialInventory',
    method: 'get',
    params
  })
}

// 获取某个文件信息
export function contentPreview(contentId) {
  return request({
    url: 'api/s2lContentPreview/' + contentId,
    method: 'get',
    responseType: 'blob',
    async: false
  })
}

// 单内信息编辑时获取全部上传图片信息
export function getContentsById(materialPurchaseDetailId) {
  return request({
    url: 'api/s2lMaterialPurchaseDetailContents/' + materialPurchaseDetailId,
    method: 'get'
  })
}

// 到船签收
export function addArrived(data) {
  return request({
    url: 'api/uploadS2lMaterialPurchaseArrived',
    method: 'post',
    data
  })
}
// 签收详情
export function getArrived(materialPurchaseArrivedId) {
  return request({
    url: 'api/s2lMaterialPurchaseArrivedContents/' + materialPurchaseArrivedId,
    method: 'get'
  })
}
export function getArrivedId(params) {
  return request({
    url: 'api/s2lMaterialPurchaseArrived',
    method: 'get',
    params
  })
}

// 单内信息编辑时删除图片信息
export function delFile(contentId) {
  return request({
    url: 'api/s2lContent/' + contentId,
    method: 'delete'
  })
}

// 单内信息编辑时删除签收单
export function delRecord(materialPurchaseDetailArrivedId) {
  return request({
    url: 'api/s2lMaterialPurchaseArrived/' + materialPurchaseDetailArrivedId,
    method: 'delete'
  })
}
// 船端审批
export function crewAudit(data) {
  return request({
    url: 'api/examineS2lMaterialPurchase',
    method: 'put',
    data
  })
}
// 查询供货信息
export function getSupplyInfo(params) {
  return request({
    url: 'api/materialPurchaseSupply',
    method: 'get',
    params
  })
}
// 添加供货信息
export function addSupplyInfo(data) {
  return request({
    url: 'api/materialPurchaseSupply',
    method: 'post',
    data
  })
}
// 编辑供货信息
export function editSupplyInfo(data) {
  return request({
    url: 'api/materialPurchaseSupply',
    method: 'put',
    data
  })
}

// 提交审批
export function materialPurchaseAudit(materialPurchaseId) {
  return request({
    url: 'api/commitMaterialPurchaseAudit?materialPurchaseId=' + materialPurchaseId,
    method: 'post'
  })
}
// 审批
export function getOAUserSecertMessage(data) {
  return request({
    url: 'api/getOAUserSecertMessage',
    method: 'post',
    data
  })
}

// 导出
export function exportMaterial(params) {
  return request({
    url: 'api/exportS2lMaterialPurchases',
    method: 'get',
    responseType: 'blob',
    params
  })
}
