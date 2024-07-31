import axios from 'axios';

const url = import.meta.env.VITE_BACKEND_URL;;

export const getProtocolDetail = async (protocol_id) => {
  
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${url}/protocol/${protocol_id}`, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    }catch (error){
        throw error
    }
};