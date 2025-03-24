import mongoose from 'mongoose';

const ResidualSchema = new mongoose.Schema({
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true },
  residualMonth: { type: String, required: true },
  residualAmount: { type: Number, required: true }
});

const Residual = mongoose.model('Residual', ResidualSchema);

export default Residual;
