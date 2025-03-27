import mongoose from 'mongoose';

const merchantSchema = new mongoose.Schema({
  merchantId:      { type: String, unique: true, required: true },
  merchantAccount: { type: String, unique: true, required: true },
  merchantName:    { type: String, unique: true, required: true },
  address: {
    city:  String,
    state: String,
    zip:   String,
    phone: String,
  },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.models.Merchant || mongoose.model('Merchant', merchantSchema);
