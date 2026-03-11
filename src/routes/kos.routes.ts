// src/routes/kos.routes.ts

import { Router } from 'express';
import {
  getAllKos,
  getMyKos,
  getKosById,
  createKos,
  updateKos,
  deleteKos,
} from '../controllers/kos.controller';
import { authenticate, authorizeOwner } from '../middlewares/auth.middleware';

const router = Router();

// Public
router.get('/', getAllKos);
router.get('/:id', getKosById);

// Owner only
router.get('/owner/my', authenticate, authorizeOwner, getMyKos);
router.post('/', authenticate, authorizeOwner, createKos);
router.put('/:id', authenticate, authorizeOwner, updateKos);
router.delete('/:id', authenticate, authorizeOwner, deleteKos);

export default router;