import axios from ".././utils/httpRequest";
var baseUrl = 'http://192.168.32.144:8081'
// var baseUrl = 'http://192.168.14.63:8080'

export const getUserList = () => {
  return axios({
    url: baseUrl+'/userList/getAll',
    method: 'get',
  });
}
