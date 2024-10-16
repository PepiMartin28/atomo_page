import axios from 'axios';

const url = import.meta.env.VITE_BACKEND_URL;;

export const resetPassword = async (id, password) => {

    const data = {
        'password' : password
    }

    try {
        const response = await axios.post(`${url}/employee/resetPassword/${id}`, data);
        return response.data;
    }catch (error){
        throw error
    }
};
