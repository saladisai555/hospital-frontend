import axiosClient from './axiosClient';

export function searchDoctors({ departmentId, specialization, page = 0, size = 12 }) {
  return axiosClient.get('/doctors', {
    params: { departmentId: departmentId || undefined, specialization: specialization || undefined, page, size },
  });
}

export function getDoctorById(id) {
  return axiosClient.get(`/doctors/${id}`);
}

export function getDoctorAvailability(doctorId, date) {
  return axiosClient.get(`/doctors/${doctorId}/availability`, { params: { date } });
}

export function getDepartments() {
  return axiosClient.get('/departments');
}