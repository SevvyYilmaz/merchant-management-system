import express from 'express';
import {
  createDevice,
  getDevices,
  getDeviceById,
  updateDevice,
  deleteDevice
} from '../controllers/deviceController.js';

const router = express.Router();

router.post('/', createDevice);         // Admin: Create device
router.get('/', getDevices);           // Admin: List/filter devices
router.get('/:id', getDeviceById);     // Admin: Get device details
router.put('/:id', updateDevice);      // Admin: Update device
router.delete('/:id', deleteDevice);   // Admin: Delete device

export default router;
