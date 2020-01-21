// 导入案卷信息：
export function DocumentExcel(data) {
  return request({
    url: 'api/DocumentExcel',
    method: 'post',
    data
  })
}
// 导入卷内信息
export function documentDetailexce(data) {
  return request({
    url: 'api/documentDetailexce',
    method: 'post',
    data
  })
}
