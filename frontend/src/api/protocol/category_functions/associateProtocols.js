import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;;

export const associateProtocols = async (category_id, protocols_id) => {

    const token = localStorage.getItem('token');

    const data = []

    for (let id of protocols_id) {
        data.push({protocol_id: id});
    }

    try {
        const response = await axios.post(`${url}/category/protocol/${category_id}`, data, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}