import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { CITIES, LOCATIONS, VEHICLE_TYPES } from '../utils/constants';

export default function Signup() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'deliveryMan' ? 'deliveryMan' : 'merchant';

  const [role, setRole] = useState(initialRole);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: CITIES[0],
    area: LOCATIONS[CITIES[0]][0],
    address: '',
    vehicleType: VEHICLE_TYPES[0]
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const setField = (field, value) => {
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (field === 'city') next.area = LOCATIONS[value][0];
      return next;
    });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    if (!form.address.trim()) errs.address = 'Address is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const user = await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role,
        location: { city: form.city, area: form.area, address: form.address },
        vehicleType: role === 'deliveryMan' ? form.vehicleType : undefined
      });
      toast.success(`Welcome, ${user.name}!`);
      navigate(role === 'merchant' ? '/merchant' : '/rider');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <div className="card border border-base-200 bg-base-100 shadow-sm">
        <div className="card-body">
          <h1 className="text-2xl font-bold text-base-content">Create your account</h1>

          <div role="tablist" className="tabs tabs-boxed mt-4 mb-2">
            <button
              type="button"
              role="tab"
              className={`tab ${role === 'merchant' ? 'tab-active' : ''}`}
              onClick={() => setRole('merchant')}
            >
              Merchant
            </button>
            <button
              type="button"
              role="tab"
              className={`tab ${role === 'deliveryMan' ? 'tab-active' : ''}`}
              onClick={() => setRole('deliveryMan')}
            >
              Delivery Man
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-neutral">Full name</span>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
              />
              {errors.name && <span className="mt-1 text-xs text-error">{errors.name}</span>}
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm text-neutral">Email</span>
              <input
                type="email"
                className="input"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
              />
              {errors.email && <span className="mt-1 text-xs text-error">{errors.email}</span>}
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-neutral">Password</span>
                <input
                  type="password"
                  className="input"
                  value={form.password}
                  onChange={(e) => setField('password', e.target.value)}
                />
                {errors.password && <span className="mt-1 text-xs text-error">{errors.password}</span>}
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-neutral">Confirm password</span>
                <input
                  type="password"
                  className="input"
                  value={form.confirmPassword}
                  onChange={(e) => setField('confirmPassword', e.target.value)}
                />
                {errors.confirmPassword && <span className="mt-1 text-xs text-error">{errors.confirmPassword}</span>}
              </label>
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-sm text-neutral">Phone</span>
              <input
                className="input"
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
              />
              {errors.phone && <span className="mt-1 text-xs text-error">{errors.phone}</span>}
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-neutral">City</span>
                <select
                  className="select"
                  value={form.city}
                  onChange={(e) => setField('city', e.target.value)}
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-neutral">Area</span>
                <select
                  className="select"
                  value={form.area}
                  onChange={(e) => setField('area', e.target.value)}
                >
                  {LOCATIONS[form.city].map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-sm text-neutral">
                {role === 'merchant' ? 'Default pickup address' : 'Your base address'}
              </span>
              <input
                className="input"
                value={form.address}
                onChange={(e) => setField('address', e.target.value)}
              />
              {errors.address && <span className="mt-1 text-xs text-error">{errors.address}</span>}
            </label>

            {role === 'deliveryMan' && (
              <label className="flex flex-col gap-1">
                <span className="text-sm text-neutral">Vehicle type</span>
                <select
                  className="select"
                  value={form.vehicleType}
                  onChange={(e) => setField('vehicleType', e.target.value)}
                >
                  {VEHICLE_TYPES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <button type="submit" className="btn btn-primary mt-2" disabled={submitting}>
              {submitting ? <span className="loading loading-spinner loading-sm" /> : 'Create account'}
            </button>
          </form>

          <p className="mt-3 text-center text-sm text-neutral">
            Already have an account?{' '}
            <Link to="/login" className="link link-primary">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
