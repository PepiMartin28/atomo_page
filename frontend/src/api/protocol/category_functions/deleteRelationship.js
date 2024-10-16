import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

export const deleteRelationship = async (category_id, protocol_id) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.delete(`${url}/category/protocol/${category_id}`, {
            headers: {
                'Authorization': `${token}`
            },
            data: { protocol_id: protocol_id } 
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
