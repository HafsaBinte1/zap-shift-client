const Order = require('../models/Order');
const StatusLog = require('../models/StatusLog');
const { STATUS_LABELS } = require('../utils/statusFlow');

exports.trackByCode = async (req, res, next) => {
  try {
    const order = await Order.findOne({ trackingCode: req.params.trackingCode }).populate(
      'deliveryManId',
      'name phone vehicleType'
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'No order found for that tracking code' });
    }

    const history = await StatusLog.find({ orderId: order._id })
      .sort({ createdAt: 1 })
      .select('status note createdAt');

    const rider = order.deliveryManId
      ? {
          firstName: order.deliveryManId.name.split(' ')[0],
          phone: order.deliveryManId.phone,
          vehicleType: order.deliveryManId.vehicleType
        }
      : null;

    res.json({
      success: true,
      data: {
        trackingCode: order.trackingCode,
        productName: order.productName,
        weight: order.weight,
        status: order.status,
        statusLabel: STATUS_LABELS[order.status] || order.status,
        pickupArea: order.pickupLocation,
        deliveryArea: { city: order.deliveryLocation.city, area: order.deliveryLocation.area },
        rider,
        createdAt: order.createdAt,
        deliveredAt: order.deliveredAt,
        history: history.map((h) => ({
          status: h.status,
          label: STATUS_LABELS[h.status] || h.status,
          note: h.note,
          at: h.createdAt
        }))
      }
    });
  } catch (err) {
    next(err);
  }
};
