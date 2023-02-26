import request from '@/utils/request'
//获取所有文章分类
export const getBlogTypes = ()=>{
    return request({
        url:'/api/blogtype',
        method:'get'
    })
}

//添加文章分类
export const addBlogType = (data={})=>{
    return request({
        url:'/api/blogtype',
        method:'post',
        data
    })
}

//编辑文章分类
export const editBlogType = (data)=>{
    return request({
        url:`/api/blogtype/${data.id}`,
        method:'put',
        data
    })
}

//删除文章分类
export const delBlogType = (id)=>{
    return request({
        url:`/api/blogtype/${id}`,
        method:'delete',
    })
}