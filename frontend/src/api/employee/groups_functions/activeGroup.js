import axios from 'axios';

const url = import.meta.env.VITE_BACKEND_URL;;

export const activeGroup = async (id) => {
  
    const token = localStorage.getItem('token');

    try {
        const response = await axios.put(`${url}/group/active/${id}`, {}, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    }catch (error){
        throw error
    }
};