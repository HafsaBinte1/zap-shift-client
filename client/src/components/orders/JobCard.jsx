export default function JobCard({ order, onAccept, accepting }) {
  return (
    <div className="flex flex-col gap-3 rounded-box border border-base-200 bg-base-100 p-4 shadow-sm">
      <div>
        <p className="font-semibold text-base-content">{order.productName}</p>
        <p className="text-xs text-neutral">{order.weight || 'Weight not specified'}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-neutral">Pickup</p>
          <p className="text-base-content">{order.pickupLocation.area}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-neutral">Drop-off</p>
          <p className="text-base-content">{order.deliveryLocation.area}, {order.deliveryLocation.city}</p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-base-200 pt-3">
        <div>
          <p className="text-xs text-neutral">COD amount</p>
          <p className="font-semibold text-base-content">৳{order.price || 0}</p>
        </div>
        <button className="btn btn-primary btn-sm" disabled={accepting} onClick={() => onAccept(order._id)}>
          {accepting ? <span className="loading loading-spinner loading-xs" /> : 'Accept'}
        </button>
      </div>
      <p className="text-[11px] text-neutral">Posted {new Date(order.createdAt).toLocaleString()}</p>
    </div>
  );
}
