import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

export const editCategory = async (id, category_name, description) => {
    const token = localStorage.getItem('token');

    const data = {
        category_name: category_name,
        description: description,
    }

    try {
        const response = await axios.put(`${url}/category/${id}`, data, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
