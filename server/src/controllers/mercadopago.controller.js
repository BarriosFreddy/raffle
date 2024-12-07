import { MercadoPagoService } from '../services/mercadopago.service.js';

export const mercadoPagoController = {
  async createPreference(req, res, next) {
    try {
      const { items, payer } = req.body;
      const result = await MercadoPagoService.createPreference({ items, payer });
      res.json(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  async getPreferenceById(req, res, next) {
    try {
      const { preferenceId } = req.params;
      const result = await MercadoPagoService.findPreferenceById(preferenceId);
      res.json(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  async getPaymentById(req, res, next) {
    try {
      const { paymentId } = req.params;
      const result = await MercadoPagoService.findPaymentById(paymentId);
      res.json(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};