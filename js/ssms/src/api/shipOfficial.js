import request from '@/utils/request'

// export function add(data) {
//   return request({
//     url: 'api/shipOfficialAnnouncement',
//     method: 'post',
//     data
//   })
// }
//
// export function del(id) {
//   return request({
//     url: 'api/s2lShipCertificate/' + id,
//     method: 'delete'
//   })
// }
//
// export function edit(data) {
//   return request({
//     url: 'api/s2lShipCertificate',
//     method: 'put',
//     data
//   })
// }
export function shipOfficialAnnouncement(params) {
  return request({
    url: 'api/shipOfficialAnnouncement',
    method: 'get',
    params
  })
}
