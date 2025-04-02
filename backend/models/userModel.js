import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
    match: /.+\@.+\..+/
  },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  assignedMerchants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Merchant' }],
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
  lastPasswordUpdated: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

// 🔐 Automatically hash password before saving (only if modified)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.lastPasswordUpdated = new Date();
  next();
});

// 🔐 Password comparison method for login
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
