import { OpenPayService } from "../services/openpay.service.js";
import { ApiError } from "../utils/ApiError.js";

export const openPayController = {
  async createPaymentLink(req, res, next) {
    try {
      const { amount, orderId, customer, description } = req.body;

      if (!amount || !orderId || !customer) {
        return next(new ApiError(400, "Missing required payment information"));
      }

      const result = await OpenPayService.createPaymentLink({
        amount,
        orderId,
        customer,
        description,
      });

      res.json(result);
    } catch (error) {
      console.error("OpenPay create payment link error:", error);
      next(error);
    }
  },
};
