import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

export const editProtocol = async (id, title, author, summary) => {
    const token = localStorage.getItem('token');

    const data = {
        title: title,
        author: author,
        summary: summary,
    }

    try {
        const response = await axios.put(`${url}/protocol/${id}`, data, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
