import axios from 'axios'

const url = import.meta.env.VITE_BACKEND_URL;;

export const protocolLog = async (protocol_id) =>{

    const token = localStorage.getItem('token');

    const data = {
        protocol_id: protocol_id
    }

    try {
        const response = await axios.post(`${url}/logs/protocol`, data , {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data.message;
    }
}