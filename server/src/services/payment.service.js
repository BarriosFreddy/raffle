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
  static async findAll(queryData) {
    console.log({ queryData });
    const { page, size, ...query } = queryData;
    const queryParams = {};
    if (query.email) queryParams["payer.email"] = query.email;
    if (query.status) queryParams.status = query.status;
    const payments = await Payment.find(queryParams)
      .skip((page - 1) * size)
      .limit(size)
      .exec();
    return payments;
  }
  static async findOne(params) {
    const payment = await Payment.findOne(params).exec();
    return payment;
  }
}
