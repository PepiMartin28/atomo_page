import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

export const deleteCategory = async (category_id) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.delete(`${url}/category/${category_id}`, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
