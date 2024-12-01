import { Router } from 'express';
import { mercadoPagoController } from '../controllers/mercadopago.controller.js';
import { isAuthenticated } from '../middleware/authenticate.middleware.js';

const router = Router();

router.post('/create-preference', isAuthenticated, mercadoPagoController.createPreference);
router.get('/preference/:preferenceId', isAuthenticated, mercadoPagoController.getPreferenceById);

export const mercadoPagoRoutes = router;