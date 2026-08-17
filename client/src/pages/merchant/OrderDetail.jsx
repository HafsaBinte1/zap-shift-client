import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getOrder, cancelOrder } from '../../api/orderApi';
import StatusBadge from '../../components/ui/StatusBadge';
import StatusTimeline from '../../components/orders/StatusTimeline';
import ConfirmModal from '../../components/ui/ConfirmModal';
import Spinner from '../../components/ui/Spinner';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

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

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelOrder(id);
      toast.success('Order cancelled');
      setConfirmOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/track/${data.order.trackingCode}`;
    navigator.clipboard.writeText(link);
    toast.success('Tracking link copied');
  };

  if (loading) return <Spinner full />;
  if (!data) return null;

  const { order, history } = data;

  return (
    <div className="flex flex-col gap-6">
      <button className="btn btn-ghost btn-sm w-fit" onClick={() => navigate('/merchant/orders')}>
        ← Back to My Orders
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

            {order.description && <p className="text-sm text-neutral">{order.description}</p>}

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
              <p className="text-base-content">
                {order.customer.name} · {order.customer.phone} · {order.customer.email}
              </p>
            </div>
            {order.deliveryManId && (
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral">Rider</p>
                <p className="text-base-content">
                  {order.deliveryManId.name} · {order.deliveryManId.phone}
                </p>
              </div>
            )}

            <div className="mt-2 flex gap-2">
              <button className="btn btn-outline btn-primary btn-sm" onClick={copyLink}>
                Copy customer tracking link
              </button>
              {order.status === 'pending' && (
                <button className="btn btn-error btn-outline btn-sm" onClick={() => setConfirmOpen(true)}>
                  Cancel order
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="card border border-base-200 bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-base text-base-content">Status timeline</h2>
            <StatusTimeline status={order.status} history={history} />
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Cancel this order?"
        message="This cannot be undone. The customer will be notified by email."
        confirmLabel={cancelling ? 'Cancelling…' : 'Yes, cancel'}
        danger
        onConfirm={handleCancel}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
}
