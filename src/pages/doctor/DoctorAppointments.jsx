import { useEffect, useState } from 'react';
import { CalendarX } from 'lucide-react';
import { getMyDoctorAppointments, updateAppointmentStatus } from '../../api/doctorPortalApi';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

const STATUS_OPTIONS = ['CONFIRMED', 'COMPLETED', 'REJECTED', 'NO_SHOW'];

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [pendingStatus, setPendingStatus] = useState({});

  function loadAppointments() {
    setLoading(true);
    getMyDoctorAppointments()
      .then((res) => setAppointments(res.data))
      .catch(() => setError('Could not load your appointments.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadAppointments(); }, []);

  async function handleUpdateStatus(id) {
    const status = pendingStatus[id];
    if (!status) return;
    setUpdatingId(id);
    setError('');
    try {
      await updateAppointmentStatus(id, { status });
      loadAppointments();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update this appointment.');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">My appointments</h1>
        <p className="text-sm text-ink-muted mt-1">Review bookings and update their status.</p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-ink-muted py-8">
          <Spinner /> Loading your appointments…
        </div>
      )}

      {error && <p className="text-sm text-danger bg-danger/10 rounded-md px-3 py-2 inline-block mb-4">{error}</p>}

      {!loading && appointments.length === 0 && (
        <div className="border border-dashed border-border rounded-lg p-10 text-center">
          <CalendarX className="mx-auto text-ink-muted mb-3" size={28} />
          <p className="text-sm text-ink-muted">No appointments booked with you yet.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {appointments.map((apt) => {
          const canModify = apt.status !== 'COMPLETED' && apt.status !== 'CANCELLED';
          return (
            <Card key={apt.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-ink">{apt.patientName}</p>
                <p className="text-sm text-ink-muted mt-1">
                  {apt.appointmentDate} at {apt.startTime.slice(0, 5)}
                </p>
                {apt.reason && <p className="text-sm text-ink-muted mt-1">Reason: {apt.reason}</p>}
              </div>

              <div className="flex items-center gap-3">
                <Badge status={apt.status} />
                {canModify && (
                  <div className="flex items-center gap-2">
                    <Select
                      value={pendingStatus[apt.id] || ''}
                      onChange={(e) => setPendingStatus({ ...pendingStatus, [apt.id]: e.target.value })}
                      className="text-xs py-1.5"
                    >
                      <option value="">Change status…</option>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </Select>
                    <Button
                      variant="secondary"
                      disabled={!pendingStatus[apt.id] || updatingId === apt.id}
                      onClick={() => handleUpdateStatus(apt.id)}
                      className="text-xs"
                    >
                      {updatingId === apt.id ? 'Saving…' : 'Update'}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}