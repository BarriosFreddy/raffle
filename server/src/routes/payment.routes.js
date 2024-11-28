import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller.js';
import { validatePaymentWebhook } from '../middleware/validate.js';

const router = Router();

router.post('/payments', paymentController.createPayment);
router.get('/payments/email/:email', paymentController.findByEmail);
router.post('/payments/webhook', validatePaymentWebhook, paymentController.handlePaymentWebhook);
router.post('/payments/:preferenceId', paymentController.handleAssignTicketNumbers);
router.get('/payments/:preferenceId/status', paymentController.getPaymentStatus);

export const paymentRoutes = router;