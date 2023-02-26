import request from '@/utils/request'

//获取页面
export const getAbout = ()=>{
    return request({
        url:'/api/about',
        method:'get'
    })
}

//设置页面
export const setAbout = (data)=>{
    return request({
        url:'/api/about',
        method:'post',
        data
    })
}