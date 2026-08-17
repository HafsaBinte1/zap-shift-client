import api from './axios';

export const createOrder = (payload) => api.post('/orders', payload).then((r) => r.data.data);

export const getMyOrders = (params) => api.get('/orders/my-orders', { params }).then((r) => r.data);

export const getAvailableOrders = () => api.get('/orders/available').then((r) => r.data.data);

export const getMyDeliveries = (status) =>
  api.get('/orders/my-deliveries', { params: status ? { status } : {} }).then((r) => r.data.data);

export const acceptOrder = (id) => api.post(`/orders/${id}/accept`).then((r) => r.data.data);

export const updateOrderStatus = (id, payload) => api.put(`/orders/${id}/status`, payload).then((r) => r.data.data);

export const getOrder = (id) => api.get(`/orders/${id}`).then((r) => r.data.data);

export const cancelOrder = (id) => api.delete(`/orders/${id}`).then((r) => r.data.data);
