const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    productName: { type: String, required: true },
    description: { type: String },
    price: { type: Number, default: 0 },
    weight: { type: String },
    imageUrl: { type: String },

    pickupLocation: {
      city: { type: String, required: true },
      area: { type: String, required: true },
      address: { type: String, required: true }
    },

    deliveryLocation: {
      city: { type: String, required: true },
      area: { type: String, required: true },
      address: { type: String, required: true }
    },

    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true }
    },

    status: {
      type: String,
      enum: ['pending', 'assigned', 'picked', 'inTransit', 'delivered', 'cancelled'],
      default: 'pending',
      index: true
    },

    deliveryManId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    trackingCode: { type: String, required: true, unique: true },
    assignedAt: { type: Date },
    deliveredAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
