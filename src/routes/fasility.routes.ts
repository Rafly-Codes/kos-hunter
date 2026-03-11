// src/routes/fasility.routes.ts

import { Router } from 'express';
import {
  getFasilities,
  createFasility,
  updateFasility,
  deleteFasility,
} from '../controllers/fasility.controller';
import { authenticate, authorizeOwner } from '../middlewares/auth.middleware';

const router = Router({ mergeParams: true });

// GET /kos/:kosId/fasilities — public
router.get('/', getFasilities);

// Owner only
router.post('/', authenticate, authorizeOwner, createFasility);
router.put('/:id', authenticate, authorizeOwner, updateFasility);
router.delete('/:id', authenticate, authorizeOwner, deleteFasility);

export default router;