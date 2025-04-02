// backend/models/merchantModel.js

import mongoose from 'mongoose';

const MerchantSchema = new mongoose.Schema({
  merchantAccount: { type: String, required: true, unique: true },
  merchantName:    { type: String, required: true, unique: true },
  address: {
    city:  { type: String },
    state: { type: String },
    zip:   { type: String },
    phone: { type: String }
  },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  devices:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }]
}, { timestamps: true });

export default mongoose.models.Merchant || mongoose.model('Merchant', MerchantSchema);
