import axios from 'axios';

const url = import.meta.env.VITE_BACKEND_URL;;

export const verifyToken = async (navigate) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }
  
    try {
      const response = await axios.post(`${url}/auth/token`, { token });
      if (response.status !== 200) {
        navigate('/login');
      }else{
        return response.data
      }
    } catch (error) {
      navigate('/login');
    }
  };