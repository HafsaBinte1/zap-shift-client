import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login({ email, password });
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'merchant' ? '/merchant' : '/rider');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm">
      <div className="card border border-base-200 bg-base-100 shadow-sm">
        <div className="card-body">
          <h1 className="text-2xl font-bold text-base-content">Welcome back</h1>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-neutral">Email</span>
              <input
                type="email"
                required
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-neutral">Password</span>
              <input
                type="password"
                required
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button type="submit" className="btn btn-primary mt-2" disabled={submitting}>
              {submitting ? <span className="loading loading-spinner loading-sm" /> : 'Log in'}
            </button>
          </form>
          <p className="mt-3 text-center text-sm text-neutral">
            New here?{' '}
            <Link to="/signup" className="link link-primary">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
