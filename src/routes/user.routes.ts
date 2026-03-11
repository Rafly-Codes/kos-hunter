// src/routes/user.routes.ts

import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// GET /users/me
router.get('/me', authenticate, getProfile);

// PUT /users/me
router.put('/me', authenticate, updateProfile);

export default router;