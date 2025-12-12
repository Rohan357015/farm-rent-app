import express from 'express';

import { ProtectRoute } from '../middleware/auth.middleware.js';
import { addBooking } from '../controllers/booking.controller.js';



const bookRouter = express.Router();

bookRouter.post('/add/:id', ProtectRoute, addBooking);

export default bookRouter;
