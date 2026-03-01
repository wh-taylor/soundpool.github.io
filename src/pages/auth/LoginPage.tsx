import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = login(email.trim(), password);
    setLoading(false);
    if (success) {
      navigate('/feed');
    } else {
      setError('Invalid email or password.');
    }
  }

  return (
    <div className="login-page">
      <div className="login-page__box panel">
        <div className="login-page__logo">
          <span>Sound</span><span className="login-page__logo-accent">Pool</span>
        </div>
        <p className="login-page__sub">sign in to your account</p>

        <form onSubmit={handleSubmit} className="login-page__form">
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="login-page__footer">
          <p>
            Don't have an account?{' '}
            <Link to="/signup">Sign up</Link>
          </p>
          <p className="login-page__demo">
            Demo: <code>rez@soundpool.io</code> / <code>demo1234</code>
          </p>
        </div>
      </div>
    </div>
  );
}
