import request from '@/utils/request'

//获取全局设置
export const getSetting = ()=>{
    return request({
        url:'/api/setting',
        method:'get'
    })
}

//设置全局设置
export const setSetting = (data)=>{
    return request({
        url:'/api/setting',
        method:'put',
        data
    })
}