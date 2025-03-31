import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from './backend/models/userModel.js';
import Merchant from './backend/models/merchantModel.js';
import Device from './backend/models/deviceModel.js';
import Residual from './backend/models/residualModel.js';

dotenv.config();
mongoose.set('strictQuery', false);

const DB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/merchantDB';

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

const clearCollections = async () => {
  await User.deleteMany();
  await Merchant.deleteMany();
  await Device.deleteMany();
  await Residual.deleteMany();
  console.log('🧹 Cleared old data');
};

const run = async () => {
  await connectDB();
  await clearCollections();

  try {
    // Admin
    const admin = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'Admin123!',
      role: 'admin',
      status: 'active'
    });
    await admin.save();
    console.log('👤 Admin user created');

    // Users
    const user1 = new User({
      username: 'hallo',
      email: 'hallo123@testemail.com',
      password: 'User123!',
      role: 'user',
      status: 'active'
    });

    const user2 = new User({
      username: 'aime',
      email: 'aime@email.com',
      password: 'User456!',
      role: 'user',
      status: 'active'
    });

    await user1.save();
    await user2.save();
    console.log('👥 Standard users created');

    // Merchants
    const merchant1 = new Merchant({
      merchantName: 'Blitz',
      merchantAccount: 'MID-BLITZ001',
      address: {
        city: 'New York',
        state: 'NY',
        zip: '10001',
        phoneNumber: '1234567890'
      },
      status: 'active',
      assignedUsers: [user1._id]
    });

    const merchant2 = new Merchant({
      merchantName: 'Diamonds',
      merchantAccount: 'MID-DIAM002',
      address: {
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001',
        phoneNumber: '9876543210'
      },
      status: 'active',
      assignedUsers: [user2._id]
    });

    await merchant1.save();
    await merchant2.save();
    console.log('🏪 Merchants created');

    // Devices
    await Device.insertMany([
      {
        merchantId: merchant1._id,
        userId: admin._id,
        deviceMake: 'Pax',
        deviceModel: 'A920',
        deviceSerialNumber: 'PAX123456',
        deviceStatus: 'active'
      },
      {
        merchantId: merchant2._id,
        userId: admin._id,
        deviceMake: 'Valor',
        deviceModel: 'V200',
        deviceSerialNumber: 'VAL987654',
        deviceStatus: 'active'
      }
    ]);
    console.log('💳 Devices created');

    // ✅ Residuals (Fixed Keys)
    await Residual.insertMany([
      {
        merchantId: merchant1._id,
        month: '2025-03',
        amount: 12345.67
      },
      {
        merchantId: merchant2._id,
        month: '2025-03',
        amount: 45678.90
      }
    ]);
    console.log('💰 Residuals created');

    console.log('🎉 DB Reset Completed!');
    process.exit();
  } catch (err) {
    console.error('❌ Reset failed:', err);
    process.exit(1);
  }
};

run();
