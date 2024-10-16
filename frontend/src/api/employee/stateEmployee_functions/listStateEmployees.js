import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;;

export const listStateEmployees = async () => {

    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${url}/stateEmployee/`, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}