import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { getDoctorById, getDoctorAvailability } from '../../api/doctorApi';
import { bookAppointment } from '../../api/appointmentApi';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

// Turns an availability rule (e.g. 09:00-13:00, 30-min slots) into a flat
// list of bookable start times: ["09:00:00", "09:30:00", ...]
function generateSlots(rules) {
  const slots = [];
  for (const rule of rules) {
    let [h, m] = rule.startTime.split(':').map(Number);
    const [endH, endM] = rule.endTime.split(':').map(Number);
    while (h < endH || (h === endH && m < endM)) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
      m += rule.slotDurationMinutes;
      while (m >= 60) { m -= 60; h += 1; }
    }
  }
  return slots;
}

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [takenSlots, setTakenSlots] = useState([]);
  const [reason, setReason] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    getDoctorById(id).then((res) => setDoctor(res.data));
  }, [id]);

  useEffect(() => {
    if (!date) { setSlots([]); return; }
    setSlotsLoading(true);
    setTakenSlots([]);
    getDoctorAvailability(id, date)
      .then((res) => setSlots(generateSlots(res.data)))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [id, date]);

  async function handleBook(slotTime) {
    setBookingLoading(true);
    setMessage(null);
    try {
      await bookAppointment({ doctorId: Number(id), appointmentDate: date, startTime: slotTime, reason });
      setMessage({ type: 'success', text: 'Appointment booked. Redirecting to your appointments…' });
      setTimeout(() => navigate('/patient/appointments'), 1400);
    } catch (err) {
      if (err.response?.status === 409) {
        setTakenSlots((prev) => [...prev, slotTime]);
        setMessage({ type: 'error', text: 'That slot was just taken by someone else — please choose another time.' });
      } else {
        setMessage({ type: 'error', text: err.response?.data?.message || 'Booking failed. Please try again.' });
      }
    } finally {
      setBookingLoading(false);
    }
  }

  if (!doctor) {
    return <div className="flex items-center gap-2 text-sm text-ink-muted py-8"><Spinner /> Loading…</div>;
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => navigate('/patient')}
        className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-6"
      >
        <ArrowLeft size={15} /> Back to search
      </button>

      <Card className="mb-6">
        <p className="font-display text-xl font-semibold text-ink">{doctor.name}</p>
        <p className="text-sm text-ink-muted mt-0.5">{doctor.specialization} — {doctor.department?.name}</p>
        <p className="text-sm text-ink mt-3">₹{doctor.consultationFee} consultation fee</p>
        {doctor.bio && <p className="text-sm text-ink-muted mt-3">{doctor.bio}</p>}
      </Card>

      <Card>
        <p className="font-display font-semibold text-ink mb-4">Book an appointment</p>

        <div className="flex gap-4 mb-4 flex-wrap">
          <Input
            label="Date"
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-48"
          />
          <Input
            label="Reason for visit"
            placeholder="Optional"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="flex-1 min-w-48"
          />
        </div>

        {!date && (
          <p className="text-sm text-ink-muted flex items-center gap-2">
            <CalendarDays size={16} /> Pick a date to see available times.
          </p>
        )}

        {slotsLoading && <p className="text-sm text-ink-muted">Loading available times…</p>}

        {date && !slotsLoading && slots.length === 0 && (
          <p className="text-sm text-ink-muted">No available slots on this date.</p>
        )}

        {slots.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {slots.map((slot) => {
              const isTaken = takenSlots.includes(slot);
              return (
                <button
                  key={slot}
                  disabled={isTaken || bookingLoading}
                  onClick={() => handleBook(slot)}
                  className={`px-3.5 py-2 rounded-md text-sm font-medium border transition-colors ${
                    isTaken
                      ? 'border-border bg-paper text-ink-muted line-through cursor-not-allowed'
                      : 'border-border text-ink hover:border-primary hover:text-primary disabled:opacity-50'
                  }`}
                >
                  {slot.slice(0, 5)}
                </button>
              );
            })}
          </div>
        )}

        {message && (
          <p className={`text-sm rounded-md px-3 py-2 mt-4 ${
            message.type === 'error' ? 'text-danger bg-danger/10' : 'text-success bg-success/10'
          }`}>
            {message.text}
          </p>
        )}
      </Card>
    </div>
  );
}