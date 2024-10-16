import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

export const addContent = async (protocol_id, content, image, document, order) => {
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('protocol_id', protocol_id);
    formData.append('content', content);
    if (image) formData.append('image', image);
    if (document) formData.append('document', document);
    formData.append('order', parseInt(order));

    try {
        const response = await axios.post(`${url}/content/`, formData, {
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'multipart/form-data' 
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
