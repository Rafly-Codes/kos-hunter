// src/routes/booking.routes.ts

import { Router } from 'express';
import {
  getMyBookings,
  getOwnerBookings,
  createBooking,
  updateBookingStatus,
  getBookingById,
} from '../controllers/booking.controller';
import { authenticate, authorizeOwner, authorizeSociety } from '../middlewares/auth.middleware';

const router = Router();

// Society
router.get('/my', authenticate, authorizeSociety, getMyBookings);
router.post('/', authenticate, authorizeSociety, createBooking);

// Owner
router.get('/owner', authenticate, authorizeOwner, getOwnerBookings);
router.patch('/:id/status', authenticate, authorizeOwner, updateBookingStatus);

// Both (society pemilik booking & owner kos)
router.get('/:id', authenticate, getBookingById);

export default router;