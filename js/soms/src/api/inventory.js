import request from '@/utils/request'

// 备件增删改查
export function addEquipment(data) {
  return request({
    url: 'api/createEquipmentPartInventory',
    method: 'post',
    data
  })
}

// 查询备件库存
export function getEquipmentInventory(params) {
  return request({
    url: 'api/s2lEquipmentPartInventory',
    method: 'get',
    params
  })
}

export function delEquipment(equipmentPartInventoryId) {
  return request({
    url: 'api/s2lEquipmentPartInventory/' + equipmentPartInventoryId,
    method: 'delete'
  })
}

export function editEquipment(data) {
  return request({
    url: 'api/s2lEquipmentPartInventory',
    method: 'put',
    data
  })
}

export function getEquipment(params) {
  return request({
    url: 'api/equipmentPartInventory',
    method: 'get',
    params
  })
}
// 获取设备
export function getEquipmentData(params) {
  return request({
    url: 'api/equipment',
    method: 'get',
    params
  })
}

// 设备id查询备件接口
export function getEquipmentPart(params) {
  return request({
    url: 'api/equipmentPartSpec',
    method: 'get',
    params
  })
}

// 备件导出
export function exportEquipment(params) {
  return request({
    url: 'api/exportInventoryByEquipmentPartSpec',
    method: 'get',
    params
  })
}
// 物资增删改查
export function addMaterial(data) {
  return request({
    url: 'api/createMaterialInventory',
    method: 'post',
    data
  })
}

export function delMaterial(materialInventoryId) {
  return request({
    url: 'api/s2lMaterialInventory/' + materialInventoryId,
    method: 'delete'
  })
}

export function editMaterial(data) {
  return request({
    url: 'api/updateS2lMaterialInventoryBySpec',
    method: 'put',
    data
  })
}

export function getMaterial(params) {
  return request({
    url: 'api/s2lMaterialInventory',
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

// 物资导出
export function exportMaterial(params) {
  return request({
    url: 'api/exportInventoryByMaterialSpecs',
    method: 'get',
    params
  })
}

// 获取全部物资规格
export function getMaterialSpec(params) {
  return request({
    url: 'api/materialSpec',
    method: 'get',
    params
  })
}
