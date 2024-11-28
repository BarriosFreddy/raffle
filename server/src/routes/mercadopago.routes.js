import { Router } from 'express';
import { mercadoPagoController } from '../controllers/mercadopago.controller.js';

const router = Router();

router.post('/create-preference', mercadoPagoController.createPreference);
router.get('/preference/:preferenceId', mercadoPagoController.getPreferenceById);

export const mercadoPagoRoutes = router;