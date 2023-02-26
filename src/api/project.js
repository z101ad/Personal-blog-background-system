import request from '@/utils/request'

//获取所有项目
export const getProjects = ()=>{
    return request({
        url:'/api/project',
        method:'get'
    })
}

//修改项目
export const editProject = (option)=>{
    return request({
        url:`/api/project/${option.id}`,
        method:'put',
        data:option
    })
}

//添加项目
export const addProject = (data)=>{
    console.log(data);
    return request({
        url:'/api/project',
        method:'post',
        data
    })
}

//删除项目
export const delProject = (id)=>{
    return request({
        url:`/api/project/${id}`,
        method:'delete'
    })
}