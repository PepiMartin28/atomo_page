import axios from 'axios';

const url = import.meta.env.VITE_BACKEND_URL;

export const registerEmployee = async (id, employee) => {
  
    const token = localStorage.getItem('token');

    const data = {
        document_num: employee.document_num,
        document_type: employee.document_type,
        last_name: employee.last_name,
        name: employee.name,
        phone: employee.phone,
        password: employee.password
    }

    try {
        const response = await axios.post(`${url}/employee/register/${id}`, data, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    }catch (error){
        throw error
    }
};
