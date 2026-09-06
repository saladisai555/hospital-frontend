import { Search, Calendar } from 'lucide-react';
import AppShell from '../../components/AppShell';

const navItems = [
  { to: '/patient', label: 'Find a doctor', icon: Search, end: true },
  { to: '/patient/appointments', label: 'My appointments', icon: Calendar },
];

export default function PatientLayout() {
  return <AppShell navItems={navItems} roleLabel="Patient" />;
}