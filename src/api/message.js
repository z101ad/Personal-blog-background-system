import request from "@/utils/request";

//提交留言
export const postMessage = (data) => {
  return request({
    url: "/api/message",
    method: "post",
    data
  });
};

//删除留言
export const delMessage= (id)=>{
    return request({
        url: `/api/message/${id}`,
        method: "delete"
    })
}

//分页获取留言
export const getMessage = (option)=>{
    return request({
        url:'/api/message',
        method: "get",
        params:option
    })
}
