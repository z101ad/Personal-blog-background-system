import request from '@/utils/request'

//单页获取评论
export const getComment = (option)=>{
    console.log(option);
    return request({
        url:'/api/comment',
        method:'get',
        params:option
    })
}

//删除评论
export const delComment = (id)=>{
    return request({
        url:`/api/comment/${id}`,
        method:'delete'
    })
}

//添加评论
export const addComment = (data)=>{
    return request({
        url:'/api/comment',
        method:'post',
        data
    })
}