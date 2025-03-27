// backend/controllers/dashboardController.js
import Merchant from '../models/Merchant.js';
import User from '../models/User.js';
import Device from '../models/Device.js';
import Residual from '../models/Residual.js';

export const getAdminDashboardStats = async (req, res) => {
  console.log("📊 GET /api/dashboard/stats hit");

  try {
    const totalMerchants = await Merchant.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalDevices = await Device.countDocuments();

    const residuals = await Residual.aggregate([
      {
        $group: {
          _id: "$residualMonth",
          total: { $sum: "$residualAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const result = {
      totalMerchants,
      totalUsers,
      totalDevices,
      residualsByMonth: residuals
    };

    console.log("📈 Dashboard Stats:", result);

    res.json(result);
  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};
