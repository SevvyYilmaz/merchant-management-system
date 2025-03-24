import Residual from '../models/residualModel.js';

// ✅ Get residuals for a specific merchant
export const getResiduals = async (req, res) => {
  const { merchantId } = req.query;

  try {
    const residuals = await Residual.find({ merchant: merchantId }).sort({ residualMonth: -1 });
    res.json(residuals);
  } catch (err) {
    console.error('❌ Error fetching residuals:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Create new residual for a merchant
export const createResidual = async (req, res) => {
  const { merchant, residualMonth, residualAmount } = req.body;

  try {
    const newResidual = new Residual({ merchant, residualMonth, residualAmount });
    await newResidual.save();
    res.status(201).json(newResidual);
  } catch (err) {
    console.error('❌ Error creating residual:', err);
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
    res.json({ message: 'Residual deleted' });
  } catch (err) {
    console.error('❌ Error deleting residual:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
