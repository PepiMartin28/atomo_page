import axios from 'axios';

const url = import.meta.env.VITE_BACKEND_URL;;

export const forgotPassword = async (mail) => {

    const data = {
        'email' : mail
    }

    try {
        const response = await axios.post(`${url}/employee/forgotPassword`, data);
        return response.data;
    }catch (error){
        throw error
    }
};
