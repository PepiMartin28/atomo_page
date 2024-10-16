import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

export const deleteRelationship = async (group_id, category_id) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.delete(`${url}/group/category/${group_id}`, {
            headers: {
                'Authorization': `${token}`
            },
            data: { category_id: category_id } 
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
