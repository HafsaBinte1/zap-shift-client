import { Link } from 'react-router-dom';
import StatusBadge from '../ui/StatusBadge';

export default function OrderCard({ order }) {
  return (
    <Link
      to={`/merchant/orders/${order._id}`}
      className="flex flex-col gap-2 rounded-box border border-base-200 bg-base-100 p-4 transition hover:border-primary/40 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="font-semibold text-base-content">{order.productName}</p>
        <p className="text-xs text-neutral">
          {order.trackingCode} · To {order.deliveryLocation.area}, {order.deliveryLocation.city}
        </p>
        {order.deliveryManId && (
          <p className="text-xs text-neutral">Rider: {order.deliveryManId.name} ({order.deliveryManId.phone})</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-neutral">{new Date(order.createdAt).toLocaleDateString()}</span>
        <StatusBadge status={order.status} />
      </div>
    </Link>
  );
}
