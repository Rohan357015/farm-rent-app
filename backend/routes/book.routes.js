import express from 'express';

import { ProtectRoute } from '../middleware/auth.middleware.js';
import { BookingForm } from '../controllers/booking.controller.js';


const bookRouter = express.Router();

bookRouter.post('/:id', ProtectRoute, BookingForm);

export default bookRouter;
