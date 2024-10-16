import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

export const activeRelationship = async (group_id, category_id) => {
    const token = localStorage.getItem('token');

    const data = {category_id : category_id}

    try {
        const response = await axios.put(`${url}/group/category/active/${group_id}`, data, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
