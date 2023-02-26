import request from '@/utils/request'

export const getBanner = ()=>{
    return request({
        url:'/api/banner',
        method:'get'
    })
}

export const setBanner = (data)=>{
    return request({
        url:'/api/banner',
        method:'post',
        data
    })
}