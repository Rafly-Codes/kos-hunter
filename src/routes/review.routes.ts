// src/routes/review.routes.ts

import { Router } from 'express';
import { getReviews, createReview, deleteReview } from '../controllers/review.controller';
import { authenticate, authorizeSociety } from '../middlewares/auth.middleware';

const router = Router({ mergeParams: true });

// GET /kos/:kosId/reviews — public
router.get('/', getReviews);

// POST /kos/:kosId/reviews — society only
router.post('/', authenticate, authorizeSociety, createReview);

// DELETE /kos/:kosId/reviews/:id — society only
router.delete('/:id', authenticate, authorizeSociety, deleteReview);

export default router;