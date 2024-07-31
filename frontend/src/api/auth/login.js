import axios from 'axios'

const url = import.meta.env.VITE_BACKEND_URL;;

export const login = async (email, password) =>{
    const data = {
        'email': email,
        'password':password
    }
    
    try {
        const response = await axios.post(`${url}/auth/login`, data);
        return response.data;
    } catch (error) {
        throw error.response.data.message;
    }
}