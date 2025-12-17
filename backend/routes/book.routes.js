import express from 'express';

import { ProtectRoute } from '../middleware/auth.middleware.js';
import { addBooking,getFarmerBookings,cancelBooking } from '../controllers/booking.controller.js';



const bookRouter = express.Router();

bookRouter.post('/add/:id', ProtectRoute, addBooking);
bookRouter.get('/farmer-bookings', ProtectRoute, getFarmerBookings);
bookRouter.post('/cancel-booking/:id',ProtectRoute,cancelBooking);

export default bookRouter;
