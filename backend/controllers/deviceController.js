import Device from '../models/deviceModel.js';

// ✅ Create Device
export const createDevice = async (req, res) => {
  try {
    const { merchantId, userId, deviceMake, deviceModel, serialNumber, deviceStatus } = req.body;

    const exists = await Device.findOne({ serialNumber });
    if (exists) return res.status(400).json({ message: 'Serial number already exists' });

    const device = new Device({ merchantId, userId, deviceMake, deviceModel, serialNumber, deviceStatus });
    await device.save();

    res.status(201).json(device);
  } catch (error) {
    console.error('❌ Error creating device:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get All Devices (with optional filters)
export const getDevices = async (req, res) => {
  try {
    const { deviceMake, deviceModel } = req.query;
    const filters = {};
    if (deviceMake) filters.deviceMake = deviceMake;
    if (deviceModel) filters.deviceModel = deviceModel;

    const devices = await Device.find(filters)
      .populate('merchantId', 'merchantName')
      .populate('userId', 'username');

    res.json(devices);
  } catch (error) {
    console.error('❌ Error fetching devices:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get Device by ID
export const getDeviceById = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id)
      .populate('merchantId', 'merchantName')
      .populate('userId', 'username');

    if (!device) return res.status(404).json({ message: 'Device not found' });

    res.json(device);
  } catch (error) {
    console.error('❌ Error fetching device by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Update Device
export const updateDevice = async (req, res) => {
  try {
    const updated = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Device not found' });

    res.json(updated);
  } catch (error) {
    console.error('❌ Error updating device:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Delete Device
export const deleteDevice = async (req, res) => {
  try {
    const deleted = await Device.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Device not found' });

    res.json({ message: 'Device deleted' });
  } catch (error) {
    console.error('❌ Error deleting device:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
