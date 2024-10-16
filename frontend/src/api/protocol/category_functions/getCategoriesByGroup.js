import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;;

export const getCategoriesByGroup = async () => {

    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${url}/category/group`, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}