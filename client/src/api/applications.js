import API from './axios';

export const applyForJob = (jobId, data) => API.post(`/applications/${jobId}/apply`, data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const getMyApplications = (params) => API.get('/applications/my-applications', { params });
export const getJobApplications = (jobId, params) => API.get(`/applications/${jobId}`, { params });
export const updateApplicationStatus = (id, data) => API.put(`/applications/${id}/status`, data);
export const getAllEmployerApplications = (params) => API.get('/applications/employer-all', { params });
