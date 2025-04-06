import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Сервер вернул ошибку
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.request);
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    } else {
      console.error('Error:', error.message);
      return Promise.reject({ message: 'An unexpected error occurred.' });
    }
  }
);

export default axiosInstance;
