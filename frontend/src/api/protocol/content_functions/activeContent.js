import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

export const activeContent = async (content_id) => {
    const token = localStorage.getItem('token');

    console.log(`${url}/content/active/${content_id}`)

    try {
        const response = await axios.put(`${url}/content/active/${content_id}`, {}, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
