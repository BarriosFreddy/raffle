import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller.js';
import { validatePaymentWebhook } from '../middleware/validate.js';
import { isAuthenticated } from '../middleware/authenticate.middleware.js';

const router = Router();

router.get('/payments', isAuthenticated, paymentController.findAll);
router.post('/payments', isAuthenticated, paymentController.createPayment);
router.get('/payments/email/:email', isAuthenticated, paymentController.findByEmail);
router.post('/payments/webhook', isAuthenticated, paymentController.handlePaymentWebhook);
router.get('/payments/bold/status/:boldOrderId', isAuthenticated, paymentController.getBoldRecordByOrderId);
router.get('/payments/mercado-pago/status/:orderId', isAuthenticated, paymentController.getMercadoPagoPaymentByOrderId);
router.post('/payments/assign', isAuthenticated, paymentController.handleAssignTicketNumbers);
router.get('/payments/:preferenceId/status', isAuthenticated, paymentController.getPaymentStatus);

export const paymentRoutes = router;