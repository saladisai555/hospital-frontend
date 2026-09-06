import { Clock, ClipboardList } from 'lucide-react';
import AppShell from '../../components/AppShell';

const navItems = [
  { to: '/doctor', label: 'My availability', icon: Clock, end: true },
  { to: '/doctor/appointments', label: 'My appointments', icon: ClipboardList },
];

export default function DoctorLayout() {
  return <AppShell navItems={navItems} roleLabel="Doctor" />;
}