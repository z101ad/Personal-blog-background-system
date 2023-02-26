import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/admin/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/admin/whoami',
    method: 'get'
  })
}

export const setInfo = (data)=>{
  return request({
    url:'/api/admin',
    method:'put',
    data
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function getCaptcha() {
  return request({
    url: '/res/captcha',
    method: 'get'
  })
}
