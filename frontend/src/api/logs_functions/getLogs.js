import axios from 'axios'

const url = import.meta.env.VITE_BACKEND_URL;;

export const getLogs = async (params, pageNum) =>{

    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${url}/logs/`, {
            params: {
                email: params.email,
                action: params.action,
                date_until: params.dateUntil,
                since_date: params.sinceDate,
                page_num: pageNum,
            },
            headers: {
                'Authorization': `${token}`
            }
        });
        return response;
    } catch (error) {
        throw error.response;
    }
}