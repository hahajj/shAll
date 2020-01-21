import request from '@/utils/request'

export function queryAll(data) {
  return request({
    url: 'api/organizationType',
    method: 'get',
    data
  })
}

// export function add(data) {
//   return request({
//     url: 'api/organizationType',
//     method: 'post',
//     data
//   })
// }

// export function del(organizationType) {
//   return request({
//     url: 'api/organizationType/' + organizationType,
//     method: 'delete'
//   })
// }

// export function edit(data) {
//   return request({
//     url: 'api/organizationType',
//     method: 'put',
//     data
//   })
// }
