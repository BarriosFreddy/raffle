import { ApiError } from '../utils/ApiError.js';
import { Validators } from '../utils/validators.js';

export const validateParticipant = (req, res, next) => {
  try {
    Validators.validateParticipant(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const validatePaymentWebhook = (req, res, next) => {
  try {
    Validators.validatePaymentWebhook(req.body);
    next();
  } catch (error) {
    next(error);
  }
};