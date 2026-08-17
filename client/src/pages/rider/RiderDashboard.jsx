import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAvailableOrders, getMyDeliveries } from '../../api/orderApi';
import Spinner from '../../components/ui/Spinner';

export default function RiderDashboard() {
  const { user } = useAuth();
  const [available, setAvailable] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAvailableOrders(), getMyDeliveries()])
      .then(([availableRes, deliveriesRes]) => {
        setAvailable(availableRes);
        setDeliveries(deliveriesRes);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeCount = deliveries.filter((d) => ['assigned', 'picked', 'inTransit'].includes(d.status)).length;
  const today = new Date().toDateString();
  const completedToday = deliveries.filter((d) => d.status === 'delivered' && new Date(d.deliveredAt).toDateString() === today).length;
  const totalCompleted = deliveries.filter((d) => d.status === 'delivered').length;

  if (loading) return <Spinner full />;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-base-content">Rider Dashboard</h1>

      <div className="alert bg-secondary/50">
        <span>
          Serving <strong>{user.location.area}, {user.location.city}</strong>.{' '}
          <Link to="/rider/profile" className="link link-primary">
            Edit area
          </Link>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Available in my area" value={available.length} />
        <Stat label="Active deliveries" value={activeCount} />
        <Stat label="Completed today" value={completedToday} />
        <Stat label="Total completed" value={totalCompleted} />
      </div>

      <div className="flex gap-3">
        <Link to="/rider/available" className="btn btn-primary">
          View Available Jobs
        </Link>
        <Link to="/rider/jobs" className="btn btn-outline btn-primary">
          My Deliveries
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat rounded-box border border-base-200 bg-base-100">
      <div className="stat-title text-neutral">{label}</div>
      <div className="stat-value text-primary">{value}</div>
    </div>
  );
}
