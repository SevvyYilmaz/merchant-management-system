import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  merchantId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true },
  userId:           { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deviceMake:       { type: String, enum: ['Pax', 'Deja Vu', 'Valor'], required: true },
  deviceModel:      { type: String, required: true },
  deviceSerialNumber: { type: String, required: true, unique: true },
  deviceStatus:     { type: String, enum: ['active', 'inactive'], default: 'active' }
});

export default mongoose.models.Device || mongoose.model('Device', deviceSchema);
