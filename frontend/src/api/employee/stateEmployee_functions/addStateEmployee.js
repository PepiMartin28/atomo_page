import axios from 'axios';

const url = import.meta.env.VITE_BACKEND_URL;

export const addStateEmployee = async (data) => {

    console.log(data)
  
    const token = localStorage.getItem('token');

    try {
        const response = await axios.post(`${url}/stateEmployee/`, data, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    }catch (error){
        throw error
    }
};
