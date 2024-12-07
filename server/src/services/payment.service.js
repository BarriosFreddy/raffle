import { Payment } from "../models/payment.js";

export class PaymentService {
  static async create(paymentData) {
    const payment = new Payment(paymentData);
    const paymentSaved = await payment.save();
    return paymentSaved;
  }
  static async findByPreferenceId(preferenceId) {
    const payment = await Payment.findOne({ preferenceId }).exec();
    return payment;
  }
  static async findByEmail(email) {
    const payments = await Payment.find({
      "payer.email": email,
    }).exec();
    return payments;
  }
  static async findOne(params) {
    const payment = await Payment.findOne(params).exec();
    return payment;
  }
}
