import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

export const activeRelationship = async (category_id, protocol_id) => {
    const token = localStorage.getItem('token');

    const data = {protocol_id : protocol_id}

    try {
        const response = await axios.put(`${url}/category/protocol/active/${category_id}`, data, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
