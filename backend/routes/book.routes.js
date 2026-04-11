import express from 'express';

import { ProtectRoute } from '../middleware/auth.middleware.js';
import {
  addBooking,
  getFarmerBookings,
  cancelBooking,
  getSupplierRequest,
  declineRequest,
  approveRequest,
  CompleteBookings,
  checkAvailability,
  getSupplierEarningsAnalytics,
} from '../controllers/booking.controller.js';

const bookRouter = express.Router();

bookRouter.get('/check-availability', ProtectRoute, checkAvailability);
bookRouter.post('/add/:id', ProtectRoute, addBooking);
bookRouter.get('/farmer-bookings', ProtectRoute, getFarmerBookings);
bookRouter.get('/supplier/earnings', ProtectRoute, getSupplierEarningsAnalytics);
bookRouter.post('/cancel-booking/:id', ProtectRoute, cancelBooking);
bookRouter.get('/rental-request', ProtectRoute, getSupplierRequest);
bookRouter.put('/decline/:id', ProtectRoute, declineRequest);
bookRouter.put('/approve/:id', ProtectRoute, approveRequest);
bookRouter.put('/complete/:id', ProtectRoute, CompleteBookings);

export default bookRouter;
