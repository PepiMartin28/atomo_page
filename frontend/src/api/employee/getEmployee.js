import axios from 'axios';

const url = import.meta.env.VITE_BACKEND_URL;;

export const getEmployee = async () => {
  
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${url}/employee/info`, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    }catch (error){
        throw error
    }
};
