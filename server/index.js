import express from 'express';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Validate required environment variables
const requiredEnvVars = ['MP_ACCESS_TOKEN', 'FRONTEND_URL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Configure CORS with specific origin
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN 
});

app.post('/create-preference', async (req, res) => {
  try {
    const { items, payer } = req.body;

    if (!items?.length || !payer) {
      return res.status(400).json({ 
        error: 'Invalid request data' 
      });
    }

    const preference = new Preference(client);
    const result = await preference.create({
      items,
      payer,
      back_urls: {
        success: `${process.env.FRONTEND_URL}/success`,
        failure: `${process.env.FRONTEND_URL}/failure`,
        pending: `${process.env.FRONTEND_URL}/pending`
      },
      auto_return: 'approved',
      statement_descriptor: 'Raffle Super App',
      expires: true,
      expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes from now
    });

    res.json(result);
  } catch (error) {
    console.error('Error creating preference:', error);
    res.status(500).json({ 
      error: 'Failed to create payment preference' 
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});