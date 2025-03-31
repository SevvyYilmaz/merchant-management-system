import Merchant from '../models/merchantModel.js';
import { v4 as uuidv4 } from 'uuid';

// Helper to generate unique MID
const generateMID = () => 'MID-' + Math.floor(100000 + Math.random() * 900000);

// ✅ Create Merchant
export const createMerchant = async (req, res) => {
  try {
    const { merchantName, address, assignedUserId } = req.body;

    const newMerchant = new Merchant({
      merchantName,
      merchantAccount: generateMID(),
      address,
      assignedUser: assignedUserId || null,
      status: 'active'
    });

    await newMerchant.save();
    res.status(201).json(newMerchant);
  } catch (err) {
    console.error('❌ Error creating merchant:', err);
    res.status(500).json({ message: 'Failed to create merchant' });
  }
};

// ✅ Get All Merchants
export const getMerchants = async (req, res) => {
  try {
    const merchants = await Merchant.find().populate('assignedUser', 'username email');
    res.status(200).json(merchants);
  } catch (err) {
    console.error('❌ Error fetching merchants:', err);
    res.status(500).json({ message: 'Failed to fetch merchants' });
  }
};

// ✅ Get Merchant by ID (with residuals and user)
export const getMerchantById = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id).populate('assignedUser', 'username email');
    if (!merchant) return res.status(404).json({ message: 'Merchant not found' });

    // Optional: Load residuals separately if needed
    const residuals = await import('../models/residualModel.js').then(m => 
      m.default.find({ merchantId: req.params.id }).sort({ residualMonth: -1 })
    );

    res.status(200).json({ merchant, residuals });
  } catch (err) {
    console.error('❌ Error loading merchant by ID:', err);
    res.status(500).json({ message: 'Failed to load merchant' });
  }
};

// ✅ Update Merchant (with assignedUser population)
export const updateMerchant = async (req, res) => {
  try {
    const updated = await Merchant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('assignedUser', 'username email');

    if (!updated) return res.status(404).json({ message: 'Merchant not found' });

    res.status(200).json(updated);
  } catch (err) {
    console.error('❌ Failed to update merchant:', err);
    res.status(500).json({ message: 'Update failed' });
  }
};

// ✅ Delete Merchant
export const deleteMerchant = async (req, res) => {
  try {
    const deleted = await Merchant.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Merchant not found' });

    res.status(200).json({ message: 'Merchant deleted successfully' });
  } catch (err) {
    console.error('❌ Failed to delete merchant:', err);
    res.status(500).json({ message: 'Delete failed' });
  }
};
