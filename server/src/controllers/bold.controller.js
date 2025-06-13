import { getHashCheckout } from '../services/bold.service.js';
import { ApiError } from '../utils/ApiError.js';

export const boldController = {
  async hashCheckout(req, res, next) {
    try {
      const { orderId, amount, currency } = req.body;
      const hash = await getHashCheckout({ orderId, amount, currency });
      res.status(201).json({ hash });
    } catch (error) {
      next(new ApiError(400, error.message || 'Failed to create BOLD checkout'));
    }
  },
};
