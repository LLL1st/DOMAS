import axios from ".././utils/httpRequest";
var baseUrl = 'http://192.168.32.144:8081'
// var baseUrl = 'http://192.168.14.63:8080'
// 查询单个对象
export const get = (item) => {
  return axios.get(baseUrl+'/api/get',item);
};


//条件分页查询
export const page = (query) => {
    return axios({
        url: baseUrl+'/API/pageAPI',
        method: 'post',
        data: query
    });
};

export const updateAPI = (item) => {
  return axios({
    url:baseUrl+'/API/updateAPI',
    method:'post',
    data:item
  });
};

export const addAPI = (item) => {
  return axios({
    url:baseUrl+'/API/addAPI',
    method:'post',
    data:item
  });
};

export const getAPIByID = (item) => {
  return axios({
    url: baseUrl+'/API/getAPIByID?id='+item,
    method: 'get',
    params: item
  });
};

// 删除 ids是数组类型
export const remove = (ids) => {
    return axios({
        url: baseUrl+'/API/delAPIByIds',
        method: 'post',
        data: ids
    });
};

export const delAPI = (item) => {
  return axios({
    url: baseUrl+'/API/delAPI',
    method: 'post',
    data: {
        id:item
    }
  });
};

