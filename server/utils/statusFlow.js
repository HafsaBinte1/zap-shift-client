const NEXT = {
  pending: ['assigned', 'cancelled'],
  assigned: ['picked'],
  picked: ['inTransit'],
  inTransit: ['delivered'],
  delivered: [],
  cancelled: []
};

const STATUS_LABELS = {
  pending: 'Order placed, finding a delivery partner',
  assigned: 'Delivery partner assigned',
  picked: 'Parcel picked up',
  inTransit: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled by sender'
};

exports.NEXT = NEXT;
exports.STATUS_LABELS = STATUS_LABELS;
exports.canTransition = (from, to) => (NEXT[from] || []).includes(to);
