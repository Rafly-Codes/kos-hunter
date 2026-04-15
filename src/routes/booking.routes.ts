import { Router } from 'express';
import {
  getMyBookings,
  getOwnerBookings,
  createBooking,
  updateBookingStatus,
  getBookingById,
} from '../controllers/booking.controller';
import { authenticate, authorizeOwner } from '../middlewares/auth.middleware';

const router = Router();

// ================= USER =================
// lihat booking sendiri
router.get('/my', authenticate, getMyBookings);

// buat booking
router.post('/', authenticate, createBooking);

// ================= OWNER =================
// lihat booking dari kos dia
router.get('/owner', authenticate, authorizeOwner, getOwnerBookings);

// accept / reject booking
router.patch('/:id/status', authenticate, authorizeOwner, updateBookingStatus);

// ================= DETAIL =================
// detail booking (user & owner bisa lihat)
router.get('/:id', authenticate, getBookingById);

export default router;