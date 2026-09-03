import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    return <p style={{ textAlign: 'center', marginTop: 80 }}>Account created! Redirecting to login...</p>;
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <h2>Patient Registration</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password (min 8 chars)" onChange={handleChange} required />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <input name="dateOfBirth" type="date" onChange={handleChange} />
        <select name="gender" onChange={handleChange}>
          <option value="">Select gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
        <input name="address" placeholder="Address" onChange={handleChange} />
        {formError && <p style={{ color: 'red' }}>{formError}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p>Already have an account? <Link to="/login">Sign in</Link></p>
    </div>
  );
}