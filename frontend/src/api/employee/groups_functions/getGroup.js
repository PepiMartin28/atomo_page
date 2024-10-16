import axios from 'axios';

const url = import.meta.env.VITE_BACKEND_URL;;

export const getGroup = async (group_id) => {
  
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${url}/group/${group_id}`, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    }catch (error){
        throw error
    }
};
