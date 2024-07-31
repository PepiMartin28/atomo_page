import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

export const activeProtocol = async (protocol_id) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.put(`${url}/protocol/active/${protocol_id}`, {}, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
