import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import {
  getMyAvailability, addAvailabilityRule, updateAvailabilityRule, deleteAvailabilityRule,
} from '../../api/doctorPortalApi';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const emptyForm = { dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '13:00', slotDurationMinutes: 30 };

export default function AvailabilityManager() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  function loadRules() {
    setLoading(true);
    getMyAvailability()
      .then((res) => setRules(res.data))
      .catch(() => setError('Could not load your availability.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadRules(); }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startEdit(rule) {
    setEditingId(rule.id);
    setShowForm(true);
    setForm({
      dayOfWeek: rule.dayOfWeek,
      startTime: rule.startTime.slice(0, 5),
      endTime: rule.endTime.slice(0, 5),
      slotDurationMinutes: rule.slotDurationMinutes,
    });
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      dayOfWeek: form.dayOfWeek,
      startTime: `${form.startTime}:00`,
      endTime: `${form.endTime}:00`,
      slotDurationMinutes: Number(form.slotDurationMinutes),
    };
    try {
      if (editingId) await updateAvailabilityRule(editingId, payload);
      else await addAvailabilityRule(payload);
      closeForm();
      loadRules();
    } catch (err) {
      // Surfaces the backend's own message directly - e.g. "This overlaps
      // an existing availability rule for that day" from Phase 6.
      setError(err.response?.data?.message || 'Could not save this rule.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Remove this availability rule?')) return;
    try {
      await deleteAvailabilityRule(id);
      loadRules();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete this rule.');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">My availability</h1>
          <p className="text-sm text-ink-muted mt-1">Set the days and hours patients can book you.</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus size={16} /> Add rule
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-display font-semibold text-ink">{editingId ? 'Edit rule' : 'New rule'}</p>
            <button onClick={closeForm} className="text-ink-muted hover:text-ink">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
            <Select label="Day" name="dayOfWeek" value={form.dayOfWeek} onChange={handleChange}>
              {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
            </Select>
            <Input label="Start time" type="time" name="startTime" value={form.startTime} onChange={handleChange} required />
            <Input label="End time" type="time" name="endTime" value={form.endTime} onChange={handleChange} required />
            <Input
              label="Slot length (min)" type="number" name="slotDurationMinutes" min="5" step="5"
              value={form.slotDurationMinutes} onChange={handleChange} required className="w-32"
            />
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Update' : 'Add'}
            </Button>
          </form>
          {error && <p className="text-sm text-danger bg-danger/10 rounded-md px-3 py-2 mt-4">{error}</p>}
        </Card>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-ink-muted py-8">
          <Spinner /> Loading your availability…
        </div>
      )}

      {!loading && rules.length === 0 && !showForm && (
        <div className="border border-dashed border-border rounded-lg p-10 text-center">
          <p className="text-sm text-ink-muted">You haven't set any availability yet.</p>
        </div>
      )}

      {rules.length > 0 && (
        <div className="flex flex-col gap-2">
          {rules.map((rule) => (
            <Card key={rule.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-ink w-24">{rule.dayOfWeek}</span>
                <span className="text-sm text-ink-muted">
                  {rule.startTime.slice(0, 5)} – {rule.endTime.slice(0, 5)}
                </span>
                <span className="text-xs text-ink-muted bg-paper border border-border rounded-full px-2.5 py-0.5">
                  {rule.slotDurationMinutes} min slots
                </span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(rule)} className="p-1.5 text-ink-muted hover:text-primary">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(rule.id)} className="p-1.5 text-ink-muted hover:text-danger">
                  <Trash2 size={15} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}