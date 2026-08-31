import api from "./api"

export const getAllTicket = async()=>{
    const response = await api.get("/tickets");
    console.log(response);
        
    return response.data;
}