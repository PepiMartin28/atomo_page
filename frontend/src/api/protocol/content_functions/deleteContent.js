import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

export const deleteContent = async (content_id) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.delete(`${url}/content/${content_id}`, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
