import axiosClient from "./axiosClient";

function examAPI(){    
    this.url = process.env.EXAM_API_ENDPOINT
    this.get = ()=>{
        return axiosClient.get(this.url)
    }
}

const ExamAPI = new examAPI();
export default ExamAPI