import axios from 'axios';

const url = import.meta.env.VITE_BACKEND_URL;;

export const changeGroup = async (employee_id, group_id) => {
  
    const token = localStorage.getItem('token');

    const data = {
        group_id: group_id
    }

    try {
        const response = await axios.put(`${url}/employee/change_group/${employee_id}`, data, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    }catch (error){
        throw error
    }
};
