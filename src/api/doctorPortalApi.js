import axiosClient from './axiosClient';

// A doctor managing their OWN data - distinct from the public,
// read-only /api/doctors endpoints patients use.
export function getMyAvailability() {
  return axiosClient.get('/doctor/availability');
}

export function addAvailabilityRule(payload) {
  return axiosClient.post('/doctor/availability', payload);
}

export function updateAvailabilityRule(id, payload) {
  return axiosClient.put(`/doctor/availability/${id}`, payload);
}

export function deleteAvailabilityRule(id) {
  return axiosClient.delete(`/doctor/availability/${id}`);
}

export function getMyDoctorAppointments() {
  return axiosClient.get('/doctor/appointments');
}

export function updateAppointmentStatus(id, payload) {
  return axiosClient.patch(`/doctor/appointments/${id}/status`, payload);
}