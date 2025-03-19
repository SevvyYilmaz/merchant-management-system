import mongoose from 'mongoose';

const DeviceSchema = new mongoose.Schema({
    merchant: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true },
    deviceMake: { type: String, enum: ['Pax', 'Deja Vu', 'Valor'], required: true },
    deviceModel: { type: String, required: true },
    serialNumber: { type: String, required: true, unique: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

export default mongoose.model('Device', DeviceSchema);