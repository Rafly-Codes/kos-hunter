// src/routes/review.routes.ts

import { Router } from 'express';
import {
  getReviews,
  createReview,
} from '../controllers/review.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router({ mergeParams: true });

// PUBLIC
router.get('/', getReviews);

// USER login
router.post('/', authenticate, createReview);

export default router;