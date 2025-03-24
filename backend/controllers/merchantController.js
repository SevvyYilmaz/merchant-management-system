import Merchant from '../models/merchantModel.js';

// ✅ Fetch all merchants from MongoDB
export const getMerchants = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit;
  
      const [merchants, totalCount] = await Promise.all([
        Merchant.find().skip(skip).limit(limit),
        Merchant.countDocuments()
      ]);
  
      res.json({ merchants, totalCount });
    } catch (error) {
      console.error("❌ Error fetching merchants:", error);
      res.status(500).json({ message: "Server Error" });
    }
  };

// ✅ Fetch a single merchant by ID
export const getMerchantById = async (req, res) => {
    console.log("📥 Requested Merchant ID:", req.params.id);
  
    try {
      const merchant = await Merchant.findById(req.params.id);
  
      if (!merchant) {
        console.warn("❌ Merchant NOT found for ID:", req.params.id);
        return res.status(404).json({ message: "Merchant not found" });
      }
  
      console.log("✅ Merchant found:", merchant);
      res.status(200).json(merchant);
    } catch (error) {
      console.error("❌ Error fetching merchant:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

// ✅ Create a new merchant
export const createMerchant = async (req, res) => {
    try {
        console.log("📦 Received body:", req.body);  

        const { merchantName, merchantAccount, address } = req.body;

        const newMerchant = new Merchant({
            merchantName,
            merchantAccount,
            address
        });

        await newMerchant.save();

        console.log("✅ Merchant saved:", newMerchant);  // 👈 Success log
        res.status(201).json(newMerchant);

    } catch (error) {
        console.error("❌ Error creating merchant:", error);
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
