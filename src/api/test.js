import {axios, url_head} from "@/api/request";
export const InitializeConfigInfo=(configInfo)=>{
    return axios.post(`${url_head}/initialize`,configInfo,{headers:{"Content-Type":'application/json'}})
        .then(res=>{
            return res;
        })
}
export const StepInfo=()=>{
    return axios.post(`${url_head}/step`)
        .then(res=>{
            return res
        })
}