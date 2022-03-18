import axios from 'axios'
import queryString from 'query-string'

const axiosClient = axios.create({
    baseURL: process.env.API_URL,
    headers:{
        "Content-Type": "application/json"
    },
    paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(function(config){        
    return config;
}, err=>{
    Promise.reject(err);
})

axiosClient.interceptors.response.use((response)=>{
    if(response && response.data){
        return response.data;
    }
    return response;
}, (error)=>{
    throw error;
});

axiosClient.defaults.xsrfCookieName= "csrftoken";
export default axiosClient;