import request from '@/utils/request'

// 主单新增
export function add(data) {
  return request({
    url: 'api/s2lEquipmentPartPurchase',
    method: 'post',
    data
  })
}

// 主单删除
export function del(equipmentPartPurchaseId) {
  return request({
    url: 'api/s2lEquipmentPartPurchase/' + equipmentPartPurchaseId,
    method: 'delete'
  })
}

// 主单编辑
export function edit(data) {
  return request({
    url: 'api/s2lEquipmentPartPurchase',
    method: 'put',
    data
  })
}

// 获取全部采购表格信息
export function get(params) {
  return request({
    url: 'api/s2lEquipmentPartPurchase',
    method: 'get',
    params
  })
}
// 获取所有设备
export function getEquipment(params) {
  return request({
    url: 'api/equipment',
    method: 'get',
    params
  })
}

// 设备id查询所属备件
export function getEquipmentPart(params) {
  return request({
    url: 'api/equipmentPartSpec',
    method: 'get',
    params
  })
}

// 通过名称查询备件规格
export function getEquipmentPartInventory(params) {
  return request({
    url: 'api/s2lEquipmentPartInventory',
    method: 'get',
    params
  })
}

// 单内新增
export function addEquipmentDetial(data) {
  return request({
    url: 'api/uploadS2lEquipmentPartPurchaseDetail',
    method: 'post',
    data
  })
}

// 单内删除
export function delEquipmentDetial(materialPurchaseDetailId) {
  return request({
    url: 'api/s2lEquipmentPartPurchaseDetail/' + materialPurchaseDetailId,
    method: 'delete'
  })
}

// 单内编辑
export function editEquipmentDetial(data) {
  return request({
    url: 'api/s2lEquipmentPartPurchaseDetail',
    method: 'put',
    data
  })
}
// 申请单--重复申请
export function repeatApply(equipmentPartPurchaseId) {
  return request({
    url: 'api/repeatApplyEquipment/' + equipmentPartPurchaseId,
    method: 'post'
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

// 单内编辑时获取全部文件
export function getContentsById(equipmentPartPurchaseDetailId) {
  return request({
    url: 'api/S2lEquipmentPartPurchaseDetailContents/' + equipmentPartPurchaseDetailId,
    method: 'get'
  })
}

// 到船签收
export function addArrived(data) {
  return request({
    url: 'api/uploadSs2lEquipmentPartPurchaseArrived',
    method: 'post',
    data
  })
}
// 签收详情
export function getArrived(equipmentPartPurchaseArrivedId) {
  return request({
    url: 'api/S2lContentsByArrivedId/' + equipmentPartPurchaseArrivedId,
    method: 'get'
  })
}

// 单内信息编辑时删除文件
export function delFile(contentId) {
  return request({
    url: 'api/s2lContent/' + contentId,
    method: 'delete'
  })
}

// 单内信息编辑时删除签收单
export function delRecord(equipmentPartPurchaseDetailId) {
  return request({
    url: 'api/s2lEquipmentPartPurchaseArrived/' + equipmentPartPurchaseDetailId,
    method: 'delete'
  })
}

export function getArrivedId(params) {
  return request({
    url: 'api/s2lEquipmentPartPurchaseArrived',
    method: 'get',
    params
  })
}

// 船端审批
export function crewAudit(data) {
  return request({
    url: 'api/s2lEquipmentPartPurchase',
    method: 'put',
    data
  })
}
// 查询供货商信息
export function getSupplyInfo(params) {
  return request({
    url: 'api/equipmentPartPurchaseSupply',
    method: 'get',
    params
  })
}
// 添加供货商信息
export function addSupplyInfo(data) {
  return request({
    url: 'api/equipmentPartPurchaseSupply',
    method: 'post',
    data
  })
}
// 编辑供货商信息
export function editSupplyInfo(data) {
  return request({
    url: 'api/equipmentPartPurchaseSupply',
    method: 'put',
    data
  })
}

// 提交审批
export function EquipmentPurchaseAudit(equipmentPartPurchaseId) {
  return request({
    url: 'api/commitEquipmentPurchaseAudit?equipmentPartPurchaseId=' + equipmentPartPurchaseId,
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
export function exportEquipment(params) {
  return request({
    url: 'api/exportS2lEquipmentPurchases',
    method: 'get',
    responseType: 'blob',
    params
  })
}
