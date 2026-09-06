import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { searchDoctors, getDepartments } from '../../api/doctorApi';
import { createDoctor, updateDoctor, deleteDoctor } from '../../api/adminApi';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

const emptyCreateForm = {
  name: '', email: '', password: '', phone: '', departmentId: '',
  specialization: '', licenseNumber: '', experienceYears: 0, consultationFee: '', bio: '',
};
const emptyEditForm = { departmentId: '', specialization: '', experienceYears: 0, consultationFee: '', bio: '', active: true };

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mode, setMode] = useState(null); // null | 'create' | editingDoctorId
  const [form, setForm] = useState(emptyCreateForm);
  const [saving, setSaving] = useState(false);

  function loadDoctors() {
    setLoading(true);
    searchDoctors({ size: 50 })
      .then((res) => setDoctors(res.data.content))
      .catch(() => setError('Could not load doctors.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadDoctors();
    getDepartments().then((res) => setDepartments(res.data)).catch(() => {});
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  }

  function startCreate() {
    setMode('create');
    setForm(emptyCreateForm);
    setError('');
  }

  function startEdit(doc) {
    setMode(doc.id);
    setForm({
      departmentId: doc.department?.id || '',
      specialization: doc.specialization || '',
      experienceYears: doc.experienceYears,
      consultationFee: doc.consultationFee,
      bio: doc.bio || '',
      active: doc.active,
    });
    setError('');
  }

  function closeForm() {
    setMode(null);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (mode === 'create') {
        await createDoctor({ ...form, experienceYears: Number(form.experienceYears), consultationFee: Number(form.consultationFee), departmentId: Number(form.departmentId) });
      } else {
        await updateDoctor(mode, { ...form, experienceYears: Number(form.experienceYears), consultationFee: Number(form.consultationFee), departmentId: Number(form.departmentId) });
      }
      closeForm();
      loadDoctors();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this doctor.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Deactivate this doctor? Existing appointment history is preserved.')) return;
    try {
      await deleteDoctor(id);
      loadDoctors();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not deactivate this doctor.');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Doctors</h1>
          <p className="text-sm text-ink-muted mt-1">Manage doctor profiles and assignments.</p>
        </div>
        {!mode && <Button onClick={startCreate}><Plus size={16} /> Add doctor</Button>}
      </div>

      {mode && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-display font-semibold text-ink">{mode === 'create' ? 'New doctor' : 'Edit doctor'}</p>
            <button onClick={closeForm} className="text-ink-muted hover:text-ink"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {mode === 'create' && (
              <>
                <Input label="Full name" name="name" value={form.name} onChange={handleChange} required />
                <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
                <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} required />
                <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
                <Input label="License number" name="licenseNumber" value={form.licenseNumber} onChange={handleChange} required />
              </>
            )}
            <Select label="Department" name="departmentId" value={form.departmentId} onChange={handleChange} required>
              <option value="" disabled>Select department</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
            <Input label="Specialization" name="specialization" value={form.specialization} onChange={handleChange} />
            <Input label="Experience (years)" type="number" min="0" name="experienceYears" value={form.experienceYears} onChange={handleChange} />
            <Input label="Consultation fee" type="number" min="0" step="0.01" name="consultationFee" value={form.consultationFee} onChange={handleChange} required />
            <Input label="Bio" name="bio" value={form.bio} onChange={handleChange} className="col-span-2" />
            {mode !== 'create' && (
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" name="active" checked={form.active} onChange={handleChange} /> Active
              </label>
            )}
            <Button type="submit" disabled={saving} className="col-span-2 self-start">
              {saving ? 'Saving…' : mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </form>
          {error && <p className="text-sm text-danger bg-danger/10 rounded-md px-3 py-2 mt-4">{error}</p>}
        </Card>
      )}

      {loading && <div className="flex items-center gap-2 text-sm text-ink-muted py-8"><Spinner /> Loading doctors…</div>}

      <div className="flex flex-col gap-2">
        {doctors.map((doc) => (
          <Card key={doc.id} className="flex items-center justify-between py-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-ink">{doc.name}</span>
                {!doc.active && <span className="text-xs text-ink-muted bg-paper border border-border rounded-full px-2 py-0.5">Inactive</span>}
              </div>
              <p className="text-sm text-ink-muted mt-0.5">{doc.specialization} — {doc.department?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-ink-muted">₹{doc.consultationFee}</span>
              <button onClick={() => startEdit(doc)} className="p-1.5 text-ink-muted hover:text-primary"><Pencil size={15} /></button>
              <button onClick={() => handleDelete(doc.id)} className="p-1.5 text-ink-muted hover:text-danger"><Trash2 size={15} /></button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}