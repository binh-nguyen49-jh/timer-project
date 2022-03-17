import axiosClient from "./axiosClient";

function examAPI(){    
    this.url = "exam"
    this.get = ()=>{
        return axiosClient.get(this.url)
    }
}

const ExamAPI = new examAPI();
export default ExamAPI