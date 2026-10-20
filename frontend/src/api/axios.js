import axios from 'axios';

// If VITE_API_BASE_URL is explicitly set, use it; otherwise use relative path ''
// which is proxied by Vercel in production (vercel.json) and Vite in development (vite.config.js)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL ? `${API_BASE_URL}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getImageUrl = (url) => {
  if (!url) return null;
  // If image URL is from the insecure HTTP backend, strip domain so it proxies securely over HTTPS
  if (url.startsWith('http://gamereviews.runasp.net')) {
    return url.replace('http://gamereviews.runasp.net', '');
  }
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

export { API_BASE_URL };
export default api;
