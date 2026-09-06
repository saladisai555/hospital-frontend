import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

import PatientLayout from './pages/patient/PatientLayout';
import DoctorSearch from './pages/patient/DoctorSearch';
import MyAppointments from './pages/patient/MyAppointments';

import DoctorLayout from './pages/doctor/DoctorLayout';
import AvailabilityManager from './pages/doctor/AvailabilityManager';
import DoctorAppointments from './pages/doctor/DoctorAppointments';

import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Departments from './pages/admin/Departments';
import Doctors from './pages/admin/Doctors';
import AdminAppointments from './pages/admin/AdminAppointments';

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user.role === 'DOCTOR') return <Navigate to="/doctor" replace />;
  return <Navigate to="/patient" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/patient"
        element={<ProtectedRoute allowedRoles={['PATIENT']}><PatientLayout /></ProtectedRoute>}
      >
        <Route index element={<DoctorSearch />} />
        <Route path="appointments" element={<MyAppointments />} />
      </Route>

      <Route
        path="/doctor"
        element={<ProtectedRoute allowedRoles={['DOCTOR']}><DoctorLayout /></ProtectedRoute>}
      >
        <Route index element={<AvailabilityManager />} />
        <Route path="appointments" element={<DoctorAppointments />} />
      </Route>

      <Route
        path="/admin"
        element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout /></ProtectedRoute>}
      >
        <Route index element={<Dashboard />} />
        <Route path="departments" element={<Departments />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="appointments" element={<AdminAppointments />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}