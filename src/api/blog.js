import request from '@/utils/request'
//分页获取文章
export const getBlogs = (options={})=>{
    options.page = options.page || 1
    options.limit = options.limit || 10
    options.categoryId = options.categoryId || -1
    options.keyword = options.keyword || ""
    return request({
        url:'/api/blog',
        method:'get',
        params:options
    })
}
//修改文章
export const editBlog = (option)=>{
    return request({
        url:`/api/blog/${option.id}`,
        method:'put',
        data:option.data
    })
}

//删除文章
export const delBlog = (id)=>{
    return request({
        url:`/api/blog/${id}`,
        method:'delete'
    })
}
//添加文章
export const addBlog = (data)=>{
    return request({
        url:'/api/blog',
        method:'post',
        data
    })
}

//获取单篇文章
export const getBlog = (id)=>{
    return request({
        url:`/api/blog/${id}`,
        method:'get'
    })
}