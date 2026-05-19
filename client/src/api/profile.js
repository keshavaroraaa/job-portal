import API from './axios';

export const getDashboard = () => API.get('/profile/dashboard');
export const updateProfile = (data) => API.put('/profile/update', data);
export const changePassword = (data) => API.put('/profile/change-password', data);
