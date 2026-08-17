import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../../api/orderApi';
import OrderCard from '../../components/orders/OrderCard';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

const IN_PROGRESS = ['assigned', 'picked', 'inTransit'];

export default function MerchantDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders({ limit: 100 })
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  const total = orders.length;
  const pending = orders.filter((o) => o.status === 'pending').length;
  const inProgress = orders.filter((o) => IN_PROGRESS.includes(o.status)).length;
  const delivered = orders.filter((o) => o.status === 'delivered').length;

  const recent = orders.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-base-content">Merchant Dashboard</h1>
        <Link to="/merchant/create" className="btn btn-primary">
          Create Delivery Order
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Total" value={total} />
        <Stat label="Pending" value={pending} />
        <Stat label="In Progress" value={inProgress} />
        <Stat label="Delivered" value={delivered} />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-base-content">Recent Orders</h2>
        {loading && <Spinner full />}
        {!loading && recent.length === 0 && (
          <EmptyState
            title="No orders yet"
            message="Create your first delivery order to see it here."
            action={
              <Link to="/merchant/create" className="btn btn-primary btn-sm">
                Create Order
              </Link>
            }
          />
        )}
        {!loading && recent.length > 0 && (
          <div className="flex flex-col gap-3">
            {recent.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
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
