import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try { await register(form.name, form.email, form.password, form.role); navigate('/'); }
    catch (err) { setError(err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || 'Registration failed'); }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card slide-up">
        <div className="auth-logo">
          <div className="logo-icon">T</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>Powered by Ethara.ai</div>
        </div>
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join TaskFlow and supercharge your team</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label htmlFor="reg-name">Full Name</label>
            <input id="reg-name" name="name" className="form-control" placeholder="John Doe" value={form.name} onChange={handleChange} required /></div>
          <div className="form-group"><label htmlFor="reg-email">Email</label>
            <input id="reg-email" name="email" type="email" className="form-control" placeholder="you@company.com" value={form.email} onChange={handleChange} required /></div>
          <div className="form-group"><label htmlFor="reg-password">Password</label>
            <input id="reg-password" name="password" type="password" className="form-control" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required /></div>
          <div className="form-group"><label htmlFor="reg-role">Role</label>
            <select id="reg-role" name="role" className="form-control" value={form.role} onChange={handleChange}>
              <option value="member">Member</option><option value="admin">Admin</option>
            </select></div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }} disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></span> : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
