import { Router } from 'express';
import { boldController } from '../controllers/bold.controller.js';
import { isAuthenticated } from '../middleware/authenticate.middleware.js';

const router = Router();

router.post('/bold/hash-checkout', isAuthenticated, boldController.hashCheckout);

export const boldRoutes = router;
