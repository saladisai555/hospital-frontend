import axiosClient from './axiosClient';

export function getDashboardStats() {
  return axiosClient.get('/admin/dashboard');
}

export function createDepartment(payload) {
  return axiosClient.post('/admin/departments', payload);
}
export function updateDepartment(id, payload) {
  return axiosClient.put(`/admin/departments/${id}`, payload);
}
export function deleteDepartment(id) {
  return axiosClient.delete(`/admin/departments/${id}`);
}

export function createDoctor(payload) {
  return axiosClient.post('/admin/doctors', payload);
}
export function updateDoctor(id, payload) {
  return axiosClient.put(`/admin/doctors/${id}`, payload);
}
export function deleteDoctor(id) {
  return axiosClient.delete(`/admin/doctors/${id}`);
}

export function getAllAppointments() {
  return axiosClient.get('/admin/appointments');
}