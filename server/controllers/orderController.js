const Order = require('../models/Order');
const StatusLog = require('../models/StatusLog');
const generateTrackingCode = require('../utils/generateTrackingCode');
const { canTransition } = require('../utils/statusFlow');
const { sendStatusEmail } = require('../services/emailService');

exports.createOrder = async (req, res, next) => {
  try {
    const { productName, description, price, weight, imageUrl, pickupLocation, deliveryLocation, customer } = req.body;

    if (!productName || !pickupLocation?.city || !pickupLocation?.area || !pickupLocation?.address) {
      return res.status(400).json({ success: false, message: 'Pickup location and product name are required' });
    }
    if (!deliveryLocation?.city || !deliveryLocation?.area || !deliveryLocation?.address) {
      return res.status(400).json({ success: false, message: 'Delivery location is required' });
    }
    if (!customer?.name || !customer?.email || !customer?.phone) {
      return res.status(400).json({ success: false, message: 'Customer name, email and phone are required' });
    }

    let trackingCode = generateTrackingCode();
    // extremely unlikely collision, but keep the unique index honest
    while (await Order.findOne({ trackingCode })) {
      trackingCode = generateTrackingCode();
    }

    const order = await Order.create({
      merchantId: req.user._id,
      productName,
      description,
      price,
      weight,
      imageUrl,
      pickupLocation,
      deliveryLocation,
      customer,
      trackingCode
    });

    await StatusLog.create({
      orderId: order._id,
      status: 'pending',
      updatedBy: req.user._id,
      actorRole: 'merchant'
    });

    sendStatusEmail({ to: customer.email, order, status: 'pending' });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

exports.myOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = { merchantId: req.user._id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('deliveryManId', 'name phone')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);

    res.json({ success: true, data: orders, meta: { total, page: Number(page), limit: Number(limit) } });
  } catch (err) {
    next(err);
  }
};

exports.availableOrders = async (req, res, next) => {
  try {
    const { city, area } = req.user.location;

    const orders = await Order.find({
      status: 'pending',
      deliveryManId: null,
      'pickupLocation.city': city,
      'pickupLocation.area': area
    })
      .select('-customer.email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

exports.myDeliveries = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { deliveryManId: req.user._id };

    if (status === 'active') {
      filter.status = { $in: ['assigned', 'picked', 'inTransit'] };
    } else if (status === 'completed') {
      filter.status = { $in: ['delivered', 'cancelled'] };
    } else if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

exports.acceptOrder = async (req, res, next) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, status: 'pending', deliveryManId: null },
      { status: 'assigned', deliveryManId: req.user._id, assignedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(409).json({ success: false, message: 'Order already accepted by another rider' });
    }

    await StatusLog.create({
      orderId: order._id,
      status: 'assigned',
      updatedBy: req.user._id,
      actorRole: 'deliveryMan'
    });

    sendStatusEmail({ to: order.customer.email, order, status: 'assigned' });

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (!order.deliveryManId || order.deliveryManId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You are not assigned to this order' });
    }
    if (!canTransition(order.status, status)) {
      return res.status(400).json({ success: false, message: `Cannot move from ${order.status} to ${status}` });
    }

    order.status = status;
    if (status === 'delivered') order.deliveredAt = new Date();
    await order.save();

    await StatusLog.create({
      orderId: order._id,
      status,
      note,
      updatedBy: req.user._id,
      actorRole: 'deliveryMan'
    });

    sendStatusEmail({ to: order.customer.email, order, status });

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('deliveryManId', 'name phone vehicleType');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const isOwnerMerchant = order.merchantId.toString() === req.user._id.toString();
    const isAssignedRider = order.deliveryManId && order.deliveryManId._id.toString() === req.user._id.toString();

    if (!isOwnerMerchant && !isAssignedRider) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    const history = await StatusLog.find({ orderId: order._id }).sort({ createdAt: 1 });
    const shapedHistory = history.map((h) => ({ status: h.status, note: h.note, at: h.createdAt }));

    res.json({ success: true, data: { order, history: shapedHistory } });
  } catch (err) {
    next(err);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, merchantId: req.user._id, status: 'pending' },
      { status: 'cancelled' },
      { new: true }
    );

    if (!order) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled (already assigned or not yours)' });
    }

    await StatusLog.create({
      orderId: order._id,
      status: 'cancelled',
      updatedBy: req.user._id,
      actorRole: 'merchant'
    });

    sendStatusEmail({ to: order.customer.email, order, status: 'cancelled' });

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};
