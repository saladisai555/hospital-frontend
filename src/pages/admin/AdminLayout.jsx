import { LayoutDashboard, Building2, Stethoscope, ClipboardList } from 'lucide-react';
import AppShell from '../../components/AppShell';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/departments', label: 'Departments', icon: Building2 },
  { to: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
  { to: '/admin/appointments', label: 'Appointments', icon: ClipboardList },
];

export default function AdminLayout() {
  return <AppShell navItems={navItems} roleLabel="Admin" />;
}