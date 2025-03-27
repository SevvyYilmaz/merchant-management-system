import mongoose from 'mongoose';

const residualSchema = new mongoose.Schema({
  merchantId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true },
  residualMonth:  { type: String, required: true }, // Format: YYYY-MM
  residualAmount: { type: Number, required: true }
});

export default mongoose.models.Residual || mongoose.model('Residual', residualSchema);
