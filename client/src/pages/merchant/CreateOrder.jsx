import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../api/orderApi';
import { CITIES, LOCATIONS } from '../../utils/constants';

const emptyLocation = { city: CITIES[0], area: LOCATIONS[CITIES[0]][0], address: '' };

export default function CreateOrder() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [parcel, setParcel] = useState({ productName: '', description: '', weight: '', price: '', imageUrl: '' });
  const [pickup, setPickup] = useState(emptyLocation);
  const [delivery, setDelivery] = useState(emptyLocation);
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [useProfileLocation, setUseProfileLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const toggleUseProfileLocation = (checked) => {
    setUseProfileLocation(checked);
    if (checked) {
      setPickup({ city: user.location.city, area: user.location.area, address: user.location.address || '' });
    }
  };

  const setLocationField = (which, field, value) => {
    const setter = which === 'pickup' ? setPickup : setDelivery;
    setter((loc) => {
      const next = { ...loc, [field]: value };
      if (field === 'city') next.area = LOCATIONS[value][0];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!parcel.productName.trim()) return toast.error('Parcel name is required');
    if (!pickup.address.trim()) return toast.error('Pickup address is required');
    if (!delivery.address.trim()) return toast.error('Delivery address is required');
    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) {
      return toast.error('Customer name, email and phone are required');
    }

    setSubmitting(true);
    try {
      const order = await createOrder({
        productName: parcel.productName,
        description: parcel.description,
        weight: parcel.weight,
        price: Number(parcel.price) || 0,
        imageUrl: parcel.imageUrl,
        pickupLocation: pickup,
        deliveryLocation: delivery,
        customer
      });
      setResult(order);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create order');
    } finally {
      setSubmitting(false);
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/track/${result.trackingCode}`;
    navigator.clipboard.writeText(link);
    toast.success('Tracking link copied');
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-base-content">Create Delivery Order</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <Section title="1. Parcel">
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField
              label="Product name"
              value={parcel.productName}
              onChange={(v) => setParcel((p) => ({ ...p, productName: v }))}
            />
            <TextField label="Weight" placeholder="2 kg" value={parcel.weight} onChange={(v) => setParcel((p) => ({ ...p, weight: v }))} />
            <TextField
              label="COD price"
              type="number"
              value={parcel.price}
              onChange={(v) => setParcel((p) => ({ ...p, price: v }))}
            />
            <TextField label="Image URL" value={parcel.imageUrl} onChange={(v) => setParcel((p) => ({ ...p, imageUrl: v }))} />
          </div>
          <TextField
            label="Description"
            value={parcel.description}
            onChange={(v) => setParcel((p) => ({ ...p, description: v }))}
          />
        </Section>

        <Section title="2. Pickup">
          <label className="flex items-center gap-2 text-sm text-base-content">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              checked={useProfileLocation}
              onChange={(e) => toggleUseProfileLocation(e.target.checked)}
            />
            Use my profile location
          </label>
          <LocationFields location={pickup} onChange={(field, v) => setLocationField('pickup', field, v)} />
        </Section>

        <Section title="3. Delivery">
          <LocationFields location={delivery} onChange={(field, v) => setLocationField('delivery', field, v)} />
        </Section>

        <Section title="4. Customer (guest)">
          <p className="text-xs text-neutral">We'll email them a tracking link.</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <TextField label="Name" value={customer.name} onChange={(v) => setCustomer((c) => ({ ...c, name: v }))} />
            <TextField
              label="Email"
              type="email"
              value={customer.email}
              onChange={(v) => setCustomer((c) => ({ ...c, email: v }))}
            />
            <TextField label="Phone" value={customer.phone} onChange={(v) => setCustomer((c) => ({ ...c, phone: v }))} />
          </div>
        </Section>

        <button type="submit" className="btn btn-primary self-start" disabled={submitting}>
          {submitting ? <span className="loading loading-spinner loading-sm" /> : 'Create Order'}
        </button>
      </form>

      {result && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold text-base-content">Order created!</h3>
            <p className="py-2 text-sm text-neutral">The customer has been emailed a tracking link.</p>
            <div className="join w-full">
              <input readOnly className="input join-item w-full font-mono" value={result.trackingCode} />
              <button className="btn btn-primary join-item" onClick={copyLink}>
                Copy Link
              </button>
            </div>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => navigate('/merchant/orders')}>
                View My Orders
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setResult(null);
                  setParcel({ productName: '', description: '', weight: '', price: '', imageUrl: '' });
                  setCustomer({ name: '', email: '', phone: '' });
                }}
              >
                Create Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="card border border-base-200 bg-base-100 shadow-sm">
      <div className="card-body gap-3">
        <h2 className="card-title text-base text-base-content">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function TextField({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-neutral">{label}</span>
      <input
        type={type}
        className="input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function LocationFields({ location, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <label className="flex flex-col gap-1">
        <span className="text-sm text-neutral">City</span>
        <select className="select" value={location.city} onChange={(e) => onChange('city', e.target.value)}>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm text-neutral">Area</span>
        <select className="select" value={location.area} onChange={(e) => onChange('area', e.target.value)}>
          {LOCATIONS[location.city].map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm text-neutral">Full address</span>
        <input
          className="input"
          value={location.address}
          onChange={(e) => onChange('address', e.target.value)}
        />
      </label>
    </div>
  );
}
