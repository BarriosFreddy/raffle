import express from 'express';
import { authController } from '../controllers/auth.controller.js';

const router = express.Router();

// Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', authController.verifyToken, authController.logout);

export const authRoutes = router;
