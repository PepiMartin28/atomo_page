import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

export const addProtocol = async (title, author, summary, category) => {
    const token = localStorage.getItem('token');

    const data = {
        title: title,
        author: author,
        summary: summary,
        category_name: category
    }

    try {
        const response = await axios.post(`${url}/protocol/`, data, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
