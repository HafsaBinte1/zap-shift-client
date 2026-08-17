import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getAvailableOrders, acceptOrder } from '../../api/orderApi';
import JobCard from '../../components/orders/JobCard';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmModal from '../../components/ui/ConfirmModal';

export default function AvailableJobs() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [pendingOrder, setPendingOrder] = useState(null);

  const load = () => {
    setLoading(true);
    getAvailableOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const confirmAccept = async () => {
    const orderId = pendingOrder._id;
    setPendingOrder(null);
    setAcceptingId(orderId);
    setOrders((prev) => prev.filter((o) => o._id !== orderId));

    try {
      await acceptOrder(orderId);
      toast.success('Job accepted — check My Deliveries');
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('Already taken by another rider');
      } else {
        toast.error(err.response?.data?.message || 'Could not accept job');
      }
      load();
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-base-content">Available Jobs</h1>

      <div className="alert bg-secondary/50">
        <span>
          Showing parcels to pick up in <strong>{user.location.area}, {user.location.city}</strong>.
        </span>
      </div>

      {loading && <Spinner full />}

      {!loading && orders.length === 0 && (
        <EmptyState title="No jobs right now" message="New parcels posted for pickup in your area will show up here." />
      )}

      {!loading && orders.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <JobCard
              key={order._id}
              order={order}
              accepting={acceptingId === order._id}
              onAccept={() => setPendingOrder(order)}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!pendingOrder}
        title="Accept this job?"
        message={pendingOrder ? `You'll be responsible for delivering "${pendingOrder.productName}".` : ''}
        confirmLabel="Accept"
        onConfirm={confirmAccept}
        onClose={() => setPendingOrder(null)}
      />
    </div>
  );
}
