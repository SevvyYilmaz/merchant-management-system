// Description: This file defines the Merchant model for use with MongoDB and Mongoose.
// Sets up the schema to ensure data integrity and relationships with other models.
import mongoose from 'mongoose';

const MerchantSchema = new mongoose.Schema({
    merchantAccount: { type: String, required: true, unique: true },
    merchantName: { type: String, required: true, unique: true },
    address: {
        city: String,
        state: String,
        zip: String,
        phone: String
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    devices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }]
});

export default mongoose.model('Merchant', MerchantSchema);