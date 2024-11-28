import express from 'express';
import cors from 'cors';
import { errorHandler, notFound } from '../middleware/error.js';
import { raffleRoutes } from '../routes/raffle.routes.js';
import { paymentRoutes } from '../routes/payment.routes.js';
import { mercadoPagoRoutes } from '../routes/mercadopago.routes.js';
import { logger } from '../utils/logger.js';

export function createApp() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PATCH'],
    allowedHeaders: ['Content-Type'],
  }));

  app.use(express.json());

  // Request logging middleware
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  // Routes
  app.use('/api', raffleRoutes);
  app.use('/api', paymentRoutes);
  app.use('/api', mercadoPagoRoutes);

  // Error handling
  app.use(notFound);
  app.use(errorHandler);

  return app;
}