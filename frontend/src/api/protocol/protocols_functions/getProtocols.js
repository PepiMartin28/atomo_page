import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

export const getProtocols = async (numPage, selectedCategory, searchTitle) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${url}/protocol/`, {
            params: {
                page: numPage,
                category: selectedCategory,
                title: searchTitle
            },
            headers: {
                'Authorization': `${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
