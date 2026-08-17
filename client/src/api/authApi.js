import api from './axios';

export const signup = (payload) => api.post('/auth/signup', payload).then((r) => r.data.data);
export const login = (payload) => api.post('/auth/login', payload).then((r) => r.data.data);
export const getMe = () => api.get('/auth/me').then((r) => r.data.data);
export const updateMe = (payload) => api.put('/auth/me', payload).then((r) => r.data.data);
