import Merchant from '../models/merchantModel.js'; // Ensure correct path

// ✅ Fetch all merchants from MongoDB
export const getMerchants = async (req, res) => {
    try {
        const merchants = await Merchant.find(); // Fetch merchants from MongoDB
        res.json(merchants);
    } catch (error) {
        res.status(500).json({ message: "Error fetching merchants", error });
    }
};

// ✅ Create a new merchant
export const createMerchant = async (req, res) => {
    try {
        const { name, businessType, location } = req.body;
        const newMerchant = new Merchant({ name, businessType, location });
        await newMerchant.save();
        res.status(201).json(newMerchant);
    } catch (error) {
        res.status(500).json({ message: "Error creating merchant", error });
    }
};

// ✅ Update a merchant
export const updateMerchant = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMerchant = await Merchant.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedMerchant) {
            return res.status(404).json({ message: "Merchant not found" });
        }
        res.json(updatedMerchant);
    } catch (error) {
        res.status(500).json({ message: "Error updating merchant", error });
    }
};

// ✅ Delete a merchant
export const deleteMerchant = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMerchant = await Merchant.findByIdAndDelete(id);
        if (!deletedMerchant) {
            return res.status(404).json({ message: "Merchant not found" });
        }
        res.json({ message: "Merchant deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting merchant", error });
    }
};

export default { getMerchants, createMerchant, updateMerchant, deleteMerchant };
