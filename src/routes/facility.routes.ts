// src/routes/fasility.routes.ts

import { Router } from 'express';
import {
  getFasilities,
  createFasility,
} from '../controllers/facility.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router({ mergeParams: true });

// PUBLIC
router.get('/', getFasilities);

// OWNER (cukup authenticate aja, validasi di controller)
router.post('/', authenticate, createFasility);

export default router;