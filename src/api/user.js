import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/users/login/',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/users/info/',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/users/logout/',
    method: 'post'
  })
}
