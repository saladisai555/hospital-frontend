import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'DOCTOR') navigate('/doctor');
      else navigate('/patient');
    } catch (err) {
      setFormError(err.message);
    }
  }

  return (
    <AuthLayout title="Sign in" subtitle="Welcome back — enter your details to continue.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {formError && (
          <p className="text-sm text-danger bg-danger/10 rounded-md px-3 py-2">{formError}</p>
        )}

        <Button type="submit" disabled={loading} className="w-full mt-2">
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="text-sm text-ink-muted text-center mt-6">
        No account?{' '}
        <Link to="/register" className="text-primary font-medium hover:underline">
          Register here
        </Link>
      </p>
    </AuthLayout>
  );
}