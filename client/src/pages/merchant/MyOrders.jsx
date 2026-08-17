import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../../api/orderApi';
import OrderCard from '../../components/orders/OrderCard';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

const TABS = [
  { key: '', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'inTransit', label: 'In Transit' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' }
];

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    getMyOrders({ limit: 100, ...(tab ? { status: tab } : {}) })
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, [tab]);

  const filtered = orders.filter((o) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return o.trackingCode.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-base-content">My Orders</h1>
        <Link to="/merchant/create" className="btn btn-primary btn-sm">
          Create Order
        </Link>
      </div>

      <div role="tablist" className="tabs tabs-boxed w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            className={`tab ${tab === t.key ? 'tab-active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <input
        className="input max-w-sm"
        placeholder="Search by tracking code or customer name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <Spinner full />}

      {!loading && filtered.length === 0 && <EmptyState title="No orders found" message="Try a different filter or search term." />}

      {!loading && filtered.length > 0 && (
        <div className="flex flex-col gap-3">
          {filtered.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
