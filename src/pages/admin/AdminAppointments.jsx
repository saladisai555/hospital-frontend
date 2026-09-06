import { useEffect, useState } from 'react';
import { getAllAppointments } from '../../api/adminApi';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import Spinner from '../../components/ui/Spinner';

const STATUSES = ['BOOKED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED', 'NO_SHOW'];

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllAppointments()
      .then((res) => setAppointments(res.data))
      .catch(() => setError('Could not load appointments.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = statusFilter ? appointments.filter((a) => a.status === statusFilter) : appointments;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">All appointments</h1>
          <p className="text-sm text-ink-muted mt-1">System-wide view across every patient and doctor.</p>
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-48">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      </div>

      {loading && <div className="flex items-center gap-2 text-sm text-ink-muted py-8"><Spinner /> Loading appointments…</div>}
      {error && <p className="text-sm text-danger bg-danger/10 rounded-md px-3 py-2 inline-block">{error}</p>}

      {!loading && filtered.length === 0 && (
        <div className="border border-dashed border-border rounded-lg p-10 text-center">
          <p className="text-sm text-ink-muted">No appointments match this filter.</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {filtered.map((apt) => (
          <Card key={apt.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-ink">{apt.patientName} → {apt.doctorName}</p>
              <p className="text-xs text-ink-muted mt-0.5">
                {apt.departmentName} · {apt.appointmentDate} at {apt.startTime.slice(0, 5)}
              </p>
            </div>
            <Badge status={apt.status} />
          </Card>
        ))}
      </div>
    </div>
  );
}