import express from 'express';
import cors from 'cors';
import { errorHandler, notFound } from '../middleware/error.js';
import { raffleRoutes } from '../routes/raffle.routes.js';
import { paymentRoutes } from '../routes/payment.routes.js';
import { mercadoPagoRoutes } from '../routes/mercadopago.routes.js';
import { logger } from '../utils/logger.js';
import { authRoutes } from '../routes/auth.routes.js';

export function createApp() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: [process.env.FRONTEND_URL_DEFAULT, process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  app.use(express.json());

  // Request logging middleware
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  // Routes
  app.get('/', (_, res) => {
    res.status(200).json({
      app: "Raffle",
      version: "0.0.1"
    })
  });
  app.use('/api', raffleRoutes);
  app.use('/api', paymentRoutes);
  app.use('/api', mercadoPagoRoutes);
  app.use('/api/auth', authRoutes);

  // Error handling
  app.use(notFound);
  app.use(errorHandler);

  return app;
}