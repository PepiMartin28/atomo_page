import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

export const activeCategory = async (category_id) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.put(`${url}/category/active/${category_id}`, {}, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
