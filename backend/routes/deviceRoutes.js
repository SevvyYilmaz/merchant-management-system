// This file defines the routes for device-related operations in the Express application.
// It imports the necessary modules and controller functions to handle requests for devices.
// The routes include getting all devices, creating a new device, updating an existing device, and deleting a device.
import express from 'express';
import { getDevices, createDevice, updateDevice, deleteDevice } from '../controllers/deviceController.js';

const router = express.Router();

router.get('/', getDevices);
router.post('/', createDevice);
router.put('/:id', updateDevice);
router.delete('/:id', deleteDevice);

export default router;

