import { Router } from 'express';

import {
  createProperty,
  deleteProperty,
  getPropertyById,
  listMyProperties,
  listProperties,
  updateProperty,
} from '../controllers/propertyController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/properties', listProperties);
router.get('/properties/mine', protect, listMyProperties);
router.post('/properties', protect, createProperty);
router.get('/properties/:id', getPropertyById);
router.put('/properties/:id', protect, updateProperty);
router.delete('/properties/:id', protect, deleteProperty);

export default router;
