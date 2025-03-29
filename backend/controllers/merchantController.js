import Merchant from '../models/merchantModel.js';

// ✅ Fetch all merchants with pagination + assigned user
export const getMerchants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const [merchants, totalCount] = await Promise.all([
      Merchant.find()
        .populate('assignedUser', 'username email')
        .skip(skip)
        .limit(limit),
      Merchant.countDocuments()
    ]);

    res.json({ merchants, totalCount });
  } catch (error) {
    console.error("❌ Error fetching merchants:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Fetch single merchant
export const getMerchantById = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id).populate('assignedUser', 'username email');

    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    res.status(200).json(merchant);
  } catch (error) {
    console.error("❌ Error fetching merchant:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Create new merchant
export const createMerchant = async (req, res) => {
  try {
    const { merchantName, merchantAccount, address, assignedUser } = req.body;

    const newMerchant = new Merchant({
      merchantName,
      merchantAccount: merchantAccount || `MID${Date.now()}`,
      address,
      assignedUser: assignedUser || null
    });

    await newMerchant.save();
    res.status(201).json(newMerchant);
  } catch (error) {
    console.error("❌ Error creating merchant:", error);
    res.status(500).json({ message: "Error creating merchant", error });
  }
};

// ✅ Update merchant
export const updateMerchant = async (req, res) => {
  try {
    const updatedMerchant = await Merchant.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedMerchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    res.json(updatedMerchant);
  } catch (error) {
    res.status(500).json({ message: "Error updating merchant", error });
  }
};

// ✅ Delete merchant
export const deleteMerchant = async (req, res) => {
  try {
    const deletedMerchant = await Merchant.findByIdAndDelete(req.params.id);

    if (!deletedMerchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    res.json({ message: "Merchant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting merchant", error });
  }
};

// ✅ Assign or Reassign merchant to a user
export const assignMerchantToUser = async (req, res) => {
  const { merchantId, userId } = req.body;

  try {
    const updated = await Merchant.findByIdAndUpdate(
      merchantId,
      { assignedUser: userId },
      { new: true }
    ).populate('assignedUser', 'username email');

    if (!updated) return res.status(404).json({ message: 'Merchant not found' });

    res.json({ message: 'Merchant assigned successfully', merchant: updated });
  } catch (err) {
    console.error('❌ Error assigning merchant:', err);
    res.status(500).json({ message: 'Error assigning merchant', error: err.message });
  }
};
