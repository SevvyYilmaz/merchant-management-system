// Residuals model for MongoDB using Mongoose
import mongoose from 'mongoose';

const ResidualSchema = new mongoose.Schema({
    merchant: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true },
    residualMonth: { type: String, required: true },
    residualAmount: { type: Number, required: true }
});

export default mongoose.model('Residual', ResidualSchema);
