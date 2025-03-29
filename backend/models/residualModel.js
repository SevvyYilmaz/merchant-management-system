import mongoose from 'mongoose';

const residualSchema = new mongoose.Schema({
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant',
    required: true,
  },
  month: {
    type: String, // format: YYYY-MM
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Residual', residualSchema);
