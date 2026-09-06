import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarX, Plus } from 'lucide-react';
import { getMyAppointments, cancelAppointment } from '../../api/appointmentApi';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

export default function MyAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  function loadAppointments() {
    setLoading(true);
    getMyAppointments()
      .then((res) => setAppointments(res.data))
      .catch(() => setError('Could not load your appointments.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  async function handleCancel(id) {
    setCancellingId(id);
    try {
      await cancelAppointment(id);
      // Re-fetch from the server rather than locally editing state, so the
      // list always reflects exactly what the backend has.
      loadAppointments();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not cancel this appointment.');
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">My appointments</h1>
          <p className="text-sm text-ink-muted mt-1">Everything you've booked, past and upcoming.</p>
        </div>
        <Button onClick={() => navigate('/patient')}>
          <Plus size={16} /> Book new
        </Button>
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
          <p className="text-sm text-ink-muted mb-4">You haven't booked any appointments yet.</p>
          <Button onClick={() => navigate('/patient')}>Find a doctor</Button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {appointments.map((apt) => {
          const canCancel = apt.status === 'BOOKED' || apt.status === 'CONFIRMED';
          return (
            <Card key={apt.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-ink">{apt.doctorName}</p>
                <p className="text-sm text-ink-muted">{apt.departmentName}</p>
                <p className="text-sm text-ink-muted mt-1">
                  {apt.appointmentDate} at {apt.startTime.slice(0, 5)}
                </p>
                {apt.reason && <p className="text-sm text-ink-muted mt-1">Reason: {apt.reason}</p>}
              </div>

              <div className="flex flex-col items-end gap-2">
                <Badge status={apt.status} />
                {canCancel && (
                  <button
                    disabled={cancellingId === apt.id}
                    onClick={() => handleCancel(apt.id)}
                    className="text-xs font-medium text-danger hover:underline disabled:opacity-50"
                  >
                    {cancellingId === apt.id ? 'Cancelling…' : 'Cancel'}
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}