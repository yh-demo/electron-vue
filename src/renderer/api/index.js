import request from '@/utils/request'

export function requestApi(url, data) {
//   return new Promise((resolve, reject) => {
  return request({
    url: url,
    method: 'post',
    data: data
  })
//       .then(response => {
//         console.log('response')
//         resolve(response)
//       }).catch(error => {
//         console.log('error')
//         reject(error)
//       })
//   })
}
