import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { searchDoctors, getDepartments } from '../../api/doctorApi';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

export default function DoctorSearch() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDepartments()
      .then((res) => setDepartments(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    searchDoctors({ departmentId, specialization })
      .then((res) => setDoctors(res.data.content))
      .catch(() => setError('Could not load doctors right now.'))
      .finally(() => setLoading(false));
  }, [departmentId, specialization]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Find a doctor</h1>
        <p className="text-sm text-ink-muted mt-1">Search by department or specialization to book an appointment.</p>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <Select
          label="Department"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          className="w-56"
        >
          <option value="">All departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </Select>
        <Input
          label="Specialization"
          placeholder="e.g. Cardiology"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="w-56"
        />
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-ink-muted py-8">
          <Spinner /> Loading doctors…
        </div>
      )}

      {error && <p className="text-sm text-danger bg-danger/10 rounded-md px-3 py-2 inline-block">{error}</p>}

      {!loading && !error && doctors.length === 0 && (
        <div className="border border-dashed border-border rounded-lg p-10 text-center">
          <p className="text-sm text-ink-muted">No doctors match these filters.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doc) => (
          <Card key={doc.id} className="flex flex-col">
            <p className="font-display font-semibold text-ink">{doc.name}</p>
            <p className="text-sm text-ink-muted mt-0.5">{doc.specialization}</p>
            <p className="text-xs text-ink-muted mt-2">{doc.department?.name}</p>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <span className="text-sm font-medium text-ink">₹{doc.consultationFee}</span>
              <Button
                variant="secondary"
                onClick={() => navigate(`/patient/doctors/${doc.id}`)}
                className="text-xs"
              >
                View & book <ArrowRight size={14} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}