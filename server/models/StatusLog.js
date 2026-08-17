const mongoose = require('mongoose');

const statusLogSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    status: { type: String, required: true },
    note: { type: String },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    actorRole: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('StatusLog', statusLogSchema);
