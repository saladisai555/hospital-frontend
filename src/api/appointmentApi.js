import axiosClient from './axiosClient';

export function bookAppointment(payload) {
  return axiosClient.post('/appointments', payload);
}

export function getMyAppointments() {
  return axiosClient.get('/appointments/my');
}

export function cancelAppointment(id) {
  return axiosClient.patch(`/appointments/${id}/cancel`);
}