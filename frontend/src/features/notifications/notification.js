import axios from './axios';

export const getNotifications = () => {
  return axios.get('/notifications');
};

export const markAsRead = (id) => {
  return axios.put(`/notifications/${id}/read`);
};