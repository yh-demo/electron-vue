import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/index/adminLogin',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/qyjz/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/qyjz/logout',
    method: 'post'
  })
}
