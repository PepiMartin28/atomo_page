import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

export const editContent = async (content_id, content, image, document, order, deleteImage, deleteDocument) => {
    const token = localStorage.getItem('token');

    const formData = new FormData();
    
    formData.append('content', content);
    if (image) formData.append('image', image);
    if (document) formData.append('document', document);
    formData.append('order', parseInt(order));
    formData.append('deleteImage', deleteImage);
    formData.append('deleteDocument', deleteDocument);

    try {
        const response = await axios.put(`${url}/content/${content_id}`, formData, {
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
