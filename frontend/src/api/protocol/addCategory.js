import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

export const addCategory = async (categoryName, description) => {
    const token = localStorage.getItem('token');

    const data = {
        category_name: categoryName,
        description: description
    }

    try {
        const response = await axios.post(`${url}/category/`, data, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
