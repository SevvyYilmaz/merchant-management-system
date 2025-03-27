import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['admin', 'user'], default: 'user' },
  status:   { type: String, enum: ['active', 'inactive'], default: 'active' },
  assignedMerchants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Merchant' }],
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
  lastPasswordUpdated: Date,
});

export default mongoose.models.User || mongoose.model('User', userSchema);
