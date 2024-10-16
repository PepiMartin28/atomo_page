import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;;

export const getUnassociatedCategories = async (id) => {

    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${url}/group/unassociated_categories/${id}`, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}