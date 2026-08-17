import api from './axios';

export const trackOrder = (code) => api.get(`/track/${code}`).then((r) => r.data.data);
