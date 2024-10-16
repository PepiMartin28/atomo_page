import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;;

export const associateCategories = async (group_id, categories_id) => {

    const token = localStorage.getItem('token');

    const data = []

    for (let id of categories_id) {
        data.push({category_id: id});
    }

    try {
        const response = await axios.post(`${url}/group/category/${group_id}`, data, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}