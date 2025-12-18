import express from 'express';

import { ProtectRoute } from '../middleware/auth.middleware.js';
import { addBooking,getFarmerBookings,cancelBooking,getSupplierRequest ,declineRequest,approveRequest,CompleteBookings} from '../controllers/booking.controller.js';



const bookRouter = express.Router();

bookRouter.post('/add/:id', ProtectRoute, addBooking);
bookRouter.get('/farmer-bookings', ProtectRoute, getFarmerBookings);
bookRouter.post('/cancel-booking/:id',ProtectRoute,cancelBooking);
bookRouter.get('/rental-request',ProtectRoute,getSupplierRequest);
bookRouter.put('/decline/:id',ProtectRoute,declineRequest);
bookRouter.put('/approve/:id',ProtectRoute,approveRequest);
bookRouter.put('/complete/:id',ProtectRoute,CompleteBookings);

export default bookRouter;
