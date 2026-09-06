import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { getDepartments } from '../../api/doctorApi';
import { createDepartment, updateDepartment, deleteDepartment } from '../../api/adminApi';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

const emptyForm = { name: '', description: '', active: true };

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  function loadDepartments() {
    setLoading(true);
    getDepartments()
      .then((res) => setDepartments(res.data))
      .catch(() => setError('Could not load departments.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadDepartments(); }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  }

  function startEdit(dept) {
    setEditingId(dept.id);
    setShowForm(true);
    setForm({ name: dept.name, description: dept.description || '', active: dept.active });
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
    try {
      if (editingId) await updateDepartment(editingId, form);
      else await createDepartment(form);
      closeForm();
      loadDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this department.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Deactivate this department? Existing doctors/appointments are preserved.')) return;
    try {
      await deleteDepartment(id);
      loadDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not deactivate this department.');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Departments</h1>
          <p className="text-sm text-ink-muted mt-1">Manage the hospital's departments.</p>
        </div>
        {!showForm && <Button onClick={() => setShowForm(true)}><Plus size={16} /> Add department</Button>}
      </div>

      {showForm && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-display font-semibold text-ink">{editingId ? 'Edit department' : 'New department'}</p>
            <button onClick={closeForm} className="text-ink-muted hover:text-ink"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Description" name="description" value={form.description} onChange={handleChange} />
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
              Active
            </label>
            <Button type="submit" disabled={saving} className="self-start">
              {saving ? 'Saving…' : editingId ? 'Update' : 'Create'}
            </Button>
          </form>
          {error && <p className="text-sm text-danger bg-danger/10 rounded-md px-3 py-2 mt-4">{error}</p>}
        </Card>
      )}

      {loading && <div className="flex items-center gap-2 text-sm text-ink-muted py-8"><Spinner /> Loading departments…</div>}

      <div className="flex flex-col gap-2">
        {departments.map((dept) => (
          <Card key={dept.id} className="flex items-center justify-between py-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-ink">{dept.name}</span>
                {!dept.active && (
                  <span className="text-xs text-ink-muted bg-paper border border-border rounded-full px-2 py-0.5">Inactive</span>
                )}
              </div>
              {dept.description && <p className="text-sm text-ink-muted mt-0.5">{dept.description}</p>}
            </div>
            <div className="flex gap-1">
              <button onClick={() => startEdit(dept)} className="p-1.5 text-ink-muted hover:text-primary"><Pencil size={15} /></button>
              <button onClick={() => handleDelete(dept.id)} className="p-1.5 text-ink-muted hover:text-danger"><Trash2 size={15} /></button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}