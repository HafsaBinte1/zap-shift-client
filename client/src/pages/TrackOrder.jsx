import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trackOrder } from '../api/trackApi';
import StatusBadge from '../components/ui/StatusBadge';
import StatusTimeline from '../components/orders/StatusTimeline';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';

export default function TrackOrder() {
  const { code: routeCode } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState(routeCode || '');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!routeCode);
  const [notFound, setNotFound] = useState(false);

  const fetchOrder = useCallback(async (trackingCode) => {
    setLoading(true);
    setNotFound(false);
    try {
      const result = await trackOrder(trackingCode);
      setData(result);
    } catch {
      setData(null);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (routeCode) fetchOrder(routeCode);
  }, [routeCode, fetchOrder]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    navigate(`/track/${code.trim()}`);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit} className="join mb-6 w-full">
        <input
          className="input join-item w-full uppercase"
          placeholder="Enter tracking code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit" className="btn btn-primary join-item">
          Track
        </button>
      </form>

      {loading && <Spinner full />}

      {!loading && notFound && (
        <EmptyState
          title="No order found"
          message="Double-check the tracking code — it should look something like RDMK3P9A2F1C."
        />
      )}

      {!loading && data && (
        <div className="flex flex-col gap-6">
          <div className="card border border-base-200 bg-base-100 shadow-sm">
            <div className="card-body gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-base-content">{data.productName}</h2>
                  <p className="text-sm text-neutral">{data.trackingCode}</p>
                </div>
                <StatusBadge status={data.status} size="badge-lg" />
              </div>
              <p className="text-sm text-neutral">
                From {data.pickupArea.area}, {data.pickupArea.city} → To {data.deliveryArea.area},{' '}
                {data.deliveryArea.city}
              </p>
              {data.rider && (
                <div className="rounded-box bg-secondary/50 p-3 text-sm">
                  <p className="font-medium text-base-content">Delivery partner: {data.rider.firstName}</p>
                  <p className="text-neutral">
                    {data.rider.phone}
                    {data.rider.vehicleType ? ` · ${data.rider.vehicleType}` : ''}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="card border border-base-200 bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-base text-base-content">Status timeline</h3>
              <StatusTimeline status={data.status} history={data.history} />
            </div>
          </div>

          <button className="btn btn-outline btn-primary self-start" onClick={() => fetchOrder(data.trackingCode)}>
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}
