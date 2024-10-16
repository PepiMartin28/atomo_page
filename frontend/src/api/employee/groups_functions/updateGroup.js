import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

export const updateGroup = async (group_id, group_name, description, access_type) => {
    const token = localStorage.getItem('token');

    const data = {
        group_name: group_name,
        description: description,
        access_type: access_type
    }

    try {
        const response = await axios.put(`${url}/group/${group_id}`, data, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
