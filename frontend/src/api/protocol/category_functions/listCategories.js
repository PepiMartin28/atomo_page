import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;;

export const listCategories = async () => {

    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${url}/category/`, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}