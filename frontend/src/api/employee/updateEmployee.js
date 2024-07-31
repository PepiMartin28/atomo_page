import axios from 'axios';

const url = import.meta.env.VITE_BACKEND_URL;;

export const updateEmployee = async (employee) => {
  
    const token = localStorage.getItem('token');

    const data = {
        document_num: employee.document_num,
        document_type: employee.document_type,
        last_name: employee.last_name,
        name: employee.name,
        phone: employee.phone
    }

    try {
        const response = await axios.put(`${url}/employee/${employee.id}`, data, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    }catch (error){
        throw error
    }
};
