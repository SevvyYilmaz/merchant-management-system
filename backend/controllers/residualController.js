import Residual from '../models/residualModel.js';

// ✅ Create a new residual entry
export const createResidual = async (req, res) => {
  const { merchantId, residualMonth, residualAmount } = req.body;

  try {
    const exists = await Residual.findOne({ merchantId, residualMonth });
    if (exists) {
      return res.status(400).json({ error: 'Residual for this month already exists for this merchant.' });
    }

    const newResidual = new Residual({ merchantId, residualMonth, residualAmount });
    await newResidual.save();
    res.status(201).json(newResidual);
  } catch (err) {
    console.error('❌ Error creating residual:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Get residuals for a specific merchant
export const getResidualsByMerchant = async (req, res) => {
  const { merchantId } = req.params;

  try {
    const residuals = await Residual.find({ merchantId }).sort({ residualMonth: -1 });
    res.json(residuals);
  } catch (err) {
    console.error('❌ Error fetching residuals by merchant:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Get residuals for a specific month (Admin View)
export const getResidualsByMonth = async (req, res) => {
  const { month } = req.params;

  try {
    const residuals = await Residual.find({ residualMonth: month })
      .populate('merchantId', 'merchantName merchantAccount');
    res.json(residuals);
  } catch (err) {
    console.error('❌ Error fetching residuals by month:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Update residual by ID
export const updateResidual = async (req, res) => {
  const { id } = req.params;
  const { residualMonth, residualAmount } = req.body;

  try {
    const updated = await Residual.findByIdAndUpdate(
      id,
      { residualMonth, residualAmount },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('❌ Error updating residual:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Delete residual by ID
export const deleteResidual = async (req, res) => {
  const { id } = req.params;

  try {
    await Residual.findByIdAndDelete(id);
    res.json({ message: 'Residual deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting residual:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
