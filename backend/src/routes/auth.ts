import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
} from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Protected routes (require authentication)
router.get('/auth/profile', authMiddleware, getProfile);
router.put('/auth/profile', authMiddleware, updateProfile);
router.post('/auth/change-password', authMiddleware, changePassword);

export default router;
