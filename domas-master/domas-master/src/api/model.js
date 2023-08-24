import axios from ".././utils/httpRequest";
var baseUrl = 'http://192.168.32.144:8081'
// var baseUrl = 'http://192.168.14.63:8080'
//条件分页查询
export const pageModel = (query) => {
    let url = baseUrl+'/model/pageModel'+(query.current &&  query.size ? '?current=' + query.current + '&size=' + query.size : '')
    return axios({
        url: url,
        method:'post',
        data: query
    });
};
// 删除 ids是数组类型
export const delModelById = (item) => {
    return axios({
        url: baseUrl+'/model/delModelById?id='+item,
        method: 'get',
        params: item
    });
};

export const idModelVo = (item) => {
  return axios({
    url: baseUrl+'/model/idModelVo?id='+item,
    method: 'get',
    params: item
  });
};

export const delModelByIds = (item) => {
  return axios({
    url: baseUrl+'/model/delModelByIds',
    method: 'post',
    data: item
  });
};

//更新模型参数
export const updateModelParameter = (item) => {
    return axios({
        url:baseUrl+'/model/updateModelParameter',
        method:'post',
        data:item
    });
};

//新增
export const addModel = (item) => {
    return axios({
        url:baseUrl+'/model/addModel',
        method:'post',
        data:item
    });
};

//修改
export const updateModel = (item) => {
    return axios({
        url:baseUrl+'/model/updateModel',
        method:'post',
        data:item
    });
};

//查询单个对象
export const get = (item) => {
    return axios({
        url:baseUrl+'/model/get',
        method:'get',
        params:item
    });
};

export const getAllModel = () => {
    return axios({
        url:baseUrl+'/model/allModel',
        method:'get',
    });
};
