import express from 'express';
import { openPayController } from '../controllers/openpay.controller.js';
import { isAuthenticated } from '../middleware/authenticate.middleware.js';


const router = express.Router();

// Create a payment link
router.post('/openpay/payment-link', isAuthenticated, openPayController.createPaymentLink);

export default router;
