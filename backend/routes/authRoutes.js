import { Router } from 'express';

import { getProfile, login, register, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/signup', register);
router.post('/signin', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
