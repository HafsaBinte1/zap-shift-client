import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getOrder, updateOrderStatus } from '../../api/orderApi';
import StatusBadge from '../../components/ui/StatusBadge';
import StatusTimeline from '../../components/orders/StatusTimeline';
import Spinner from '../../components/ui/Spinner';

const NEXT_STATUS = { assigned: 'picked', picked: 'inTransit', inTransit: 'delivered' };
const NEXT_LABEL = { assigned: 'Mark as Picked Up', picked: 'Start Transit', inTransit: 'Mark as Delivered' };

export default function DeliveryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const load = () => {
    setLoading(true);
    getOrder(id)
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAdvance = async () => {
    const nextStatus = NEXT_STATUS[data.order.status];
    if (!nextStatus) return;

    setUpdating(true);
    try {
      await updateOrderStatus(id, { status: nextStatus, note: note.trim() || undefined });
      toast.success(`Order marked as ${nextStatus}`);
      setNote('');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Spinner full />;
  if (!data) return null;

  const { order, history } = data;
  const nextLabel = NEXT_LABEL[order.status];

  return (
    <div className="flex flex-col gap-6">
      <button className="btn btn-ghost btn-sm w-fit" onClick={() => navigate('/rider/jobs')}>
        ← Back to My Deliveries
      </button>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card border border-base-200 bg-base-100 shadow-sm">
          <div className="card-body gap-3">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-base-content">{order.productName}</h1>
                <p className="text-sm font-mono text-neutral">{order.trackingCode}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="divider my-0" />

            <div>
              <p className="text-xs uppercase tracking-wide text-neutral">Pickup</p>
              <p className="text-base-content">
                {order.pickupLocation.address}, {order.pickupLocation.area}, {order.pickupLocation.city}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral">Delivery</p>
              <p className="text-base-content">
                {order.deliveryLocation.address}, {order.deliveryLocation.area}, {order.deliveryLocation.city}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral">Customer</p>
              <p className="text-base-content">{order.customer.name}</p>
              <a href={`tel:${order.customer.phone}`} className="link link-primary">
                {order.customer.phone}
              </a>
            </div>

            {nextLabel ? (
              <div className="mt-2 flex flex-col gap-2 rounded-box border border-base-200 p-3">
                <textarea
                  className="textarea"
                  placeholder="Optional note (visible to the customer)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleAdvance} disabled={updating}>
                  {updating ? <span className="loading loading-spinner loading-sm" /> : nextLabel}
                </button>
              </div>
            ) : (
              <p className="mt-2 text-sm text-neutral">This order is complete and read-only.</p>
            )}
          </div>
        </div>

        <div className="card border border-base-200 bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-base text-base-content">Status timeline</h2>
            <StatusTimeline status={order.status} history={history} />
          </div>
        </div>
      </div>
    </div>
  );
}
