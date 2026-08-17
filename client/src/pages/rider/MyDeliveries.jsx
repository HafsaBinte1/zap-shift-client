import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyDeliveries } from '../../api/orderApi';
import StatusBadge from '../../components/ui/StatusBadge';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

const NEXT_ACTION_LABEL = {
  assigned: 'Mark as Picked Up',
  picked: 'Start Transit',
  inTransit: 'Mark as Delivered'
};

export default function MyDeliveries() {
  const [tab, setTab] = useState('active');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMyDeliveries(tab)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [tab]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-base-content">My Deliveries</h1>

      <div role="tablist" className="tabs tabs-boxed w-fit">
        <button role="tab" className={`tab ${tab === 'active' ? 'tab-active' : ''}`} onClick={() => setTab('active')}>
          Active
        </button>
        <button role="tab" className={`tab ${tab === 'completed' ? 'tab-active' : ''}`} onClick={() => setTab('completed')}>
          Completed
        </button>
      </div>

      {loading && <Spinner full />}

      {!loading && orders.length === 0 && <EmptyState title="Nothing here" message="Accepted jobs will show up in this list." />}

      {!loading && orders.length > 0 && (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/rider/jobs/${order._id}`}
              className="flex flex-col gap-2 rounded-box border border-base-200 bg-base-100 p-4 transition hover:border-primary/40 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-base-content">{order.productName}</p>
                <p className="text-xs text-neutral">
                  {order.trackingCode} · {order.pickupLocation.area} → {order.deliveryLocation.area}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={order.status} />
                {NEXT_ACTION_LABEL[order.status] && (
                  <span className="btn btn-primary btn-xs pointer-events-none">{NEXT_ACTION_LABEL[order.status]}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
