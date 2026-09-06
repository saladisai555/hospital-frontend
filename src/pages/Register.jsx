import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    dateOfBirth: '', gender: '', address: '',
  });
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    try {
      await register(form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setFormError(err.message);
    }
  }

  if (success) {
    return (
      <AuthLayout title="Account created">
        <p className="text-sm text-ink-muted">Redirecting you to sign in…</p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create your account" subtitle="Patient registration — takes less than a minute.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input name="name" label="Full name" onChange={handleChange} required />
        <Input name="email" type="email" label="Email" onChange={handleChange} required />
        <Input name="password" type="password" label="Password" placeholder="Min. 8 characters" onChange={handleChange} required />
        <Input name="phone" label="Phone" onChange={handleChange} />
        <Input name="dateOfBirth" type="date" label="Date of birth" onChange={handleChange} />
        <Select name="gender" label="Gender" onChange={handleChange} defaultValue="">
          <option value="" disabled>Select gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </Select>
        <Input name="address" label="Address" onChange={handleChange} />

        {formError && (
          <p className="text-sm text-danger bg-danger/10 rounded-md px-3 py-2">{formError}</p>
        )}

        <Button type="submit" disabled={loading} className="w-full mt-2">
          {loading ? 'Creating account…' : 'Register'}
        </Button>
      </form>

      <p className="text-sm text-ink-muted text-center mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}