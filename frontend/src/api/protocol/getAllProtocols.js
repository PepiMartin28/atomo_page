import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

export const getAllProtocols = async (numPage, selectedCategory, searchTitle, selectedState) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${url}/protocol/all`, {
            params: {
                page: numPage,
                category: selectedCategory,
                title: searchTitle,
                state: selectedState
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
