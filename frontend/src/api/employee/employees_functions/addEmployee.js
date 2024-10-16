import axios from 'axios';

const url = import.meta.env.VITE_BACKEND_URL;

export const addEmployee = async (data) => {
  
    const token = localStorage.getItem('token');

    try {
        const response = await axios.post(`${url}/employee/`, data, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    }catch (error){
        throw error
    }
};
