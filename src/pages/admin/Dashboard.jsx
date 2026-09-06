import { useEffect, useState } from 'react';
import { Users, Stethoscope, Building2, ClipboardList } from 'lucide-react';
import { getDashboardStats } from '../../api/adminApi';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card className="flex items-center gap-4">
      <div className="w-11 h-11 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
        <Icon size={20} className="text-primary" />
      </div>
      <div>
        <p className="text-2xl font-display font-semibold text-ink leading-none">{value}</p>
        <p className="text-sm text-ink-muted mt-1">{label}</p>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch(() => setError('Could not load dashboard stats.'));
  }, []);

  if (error) return <p className="text-sm text-danger bg-danger/10 rounded-md px-3 py-2 inline-block">{error}</p>;
  if (!stats) return <div className="flex items-center gap-2 text-sm text-ink-muted py-8"><Spinner /> Loading dashboard…</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>
        <p className="text-sm text-ink-muted mt-1">A snapshot of the whole system.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Patients" value={stats.totalPatients} />
        <StatCard icon={Stethoscope} label="Doctors" value={stats.totalDoctors} />
        <StatCard icon={Building2} label="Departments" value={stats.totalDepartments} />
        <StatCard icon={ClipboardList} label="Appointments" value={stats.totalAppointments} />
      </div>

      <Card>
        <p className="font-display font-semibold text-ink mb-4">Appointments by status</p>
        <div className="flex gap-8">
          <div>
            <p className="text-xl font-semibold text-info">{stats.bookedAppointments}</p>
            <p className="text-sm text-ink-muted">Booked</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-success">{stats.completedAppointments}</p>
            <p className="text-sm text-ink-muted">Completed</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-danger">{stats.cancelledAppointments}</p>
            <p className="text-sm text-ink-muted">Cancelled</p>
          </div>
        </div>
      </Card>
    </div>
  );
}