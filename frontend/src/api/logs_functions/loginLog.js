import axios from 'axios'

const url = import.meta.env.VITE_BACKEND_URL;;

export const loginLog = async () =>{

    const token = localStorage.getItem('token');

    try {
        const response = await axios.post(`${url}/logs/login`, {}, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response;
    } catch (error) {
        throw error.response;
    }
}