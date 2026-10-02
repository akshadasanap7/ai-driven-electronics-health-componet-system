import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const msg = err.response?.data?.detail || err.message || 'Request failed';
    return Promise.reject(new Error(msg));
  }
);

export const getSystemStatus = () => api.get('/api/system/status').then(r => r.data);
export const getComponents = () => api.get('/api/components').then(r => r.data);
export const createTest = (data) => api.post('/api/tests', data).then(r => r.data);
export const startTest = (id) => api.post(`/api/tests/${id}/start`).then(r => r.data);
export const getTest = (id) => api.get(`/api/tests/${id}`).then(r => r.data);
export const acquireMeasurement = (id) => api.post(`/api/tests/${id}/measure`).then(r => r.data);
export const getMeasurements = (id) => api.get(`/api/tests/${id}/measurements`).then(r => r.data);
export const runDiagnosis = (id) => api.post(`/api/tests/${id}/diagnose`).then(r => r.data);
export const getDiagnosis = (id) => api.get(`/api/tests/${id}/diagnosis`).then(r => r.data);
export const getReport = (id) => api.get(`/api/tests/${id}/report`).then(r => r.data);
export const getHistory = () => api.get('/api/history').then(r => r.data);
export const getAllTests = () => api.get('/api/tests').then(r => r.data);
