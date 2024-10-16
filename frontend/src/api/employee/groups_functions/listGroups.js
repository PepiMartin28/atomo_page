import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;;

export const listGroups = async () => {

    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${url}/group/`, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}