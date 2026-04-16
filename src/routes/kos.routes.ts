import { Router } from 'express';
import {
  getAllKos,
  getMyKos,
  getKosById,
  createKos,
  updateKos,
  deleteKos,
} from '../controllers/kos.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// PUBLIC
router.get('/', getAllKos);
router.get('/:id', getKosById);

// OWNER
router.get('/my', authenticate, getMyKos);
router.post('/', authenticate, createKos);
router.put('/:id', authenticate, updateKos);
router.delete('/:id', authenticate, deleteKos);

export default router;