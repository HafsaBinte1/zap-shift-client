import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { CITIES, LOCATIONS } from '../../utils/constants';

export default function RiderProfile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone,
    city: user.location.city,
    area: user.location.area,
    address: user.location.address || ''
  });
  const [submitting, setSubmitting] = useState(false);

  const setField = (field, value) => {
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (field === 'city') next.area = LOCATIONS[value][0];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateProfile({
        name: form.name,
        phone: form.phone,
        location: { city: form.city, area: form.area, address: form.address }
      });
      toast.success('Profile updated — your job board now reflects the new area');
      navigate('/rider');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <div className="card border border-base-200 bg-base-100 shadow-sm">
        <div className="card-body">
          <h1 className="text-2xl font-bold text-base-content">Edit your service area</h1>
          <p className="text-sm text-neutral">Changing your area changes which jobs you see on the job board.</p>

          <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-neutral">Name</span>
              <input className="input" value={form.name} onChange={(e) => setField('name', e.target.value)} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-neutral">Phone</span>
              <input className="input" value={form.phone} onChange={(e) => setField('phone', e.target.value)} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-neutral">City</span>
                <select className="select" value={form.city} onChange={(e) => setField('city', e.target.value)}>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-neutral">Area</span>
                <select className="select" value={form.area} onChange={(e) => setField('area', e.target.value)}>
                  {LOCATIONS[form.city].map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-neutral">Address</span>
              <input className="input" value={form.address} onChange={(e) => setField('address', e.target.value)} />
            </label>
            <button type="submit" className="btn btn-primary mt-2" disabled={submitting}>
              {submitting ? <span className="loading loading-spinner loading-sm" /> : 'Save changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
