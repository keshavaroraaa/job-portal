import API from './axios';

export const getAllJobs = (params) => API.get('/jobs', { params });
export const getJobById = (id) => API.get(`/jobs/${id}`);
export const getMyJobs = (params) => API.get('/jobs/my-jobs', { params });
export const createJob = (data) => API.post('/jobs', data);
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);
export const getCategories = () => API.get('/jobs/categories');
