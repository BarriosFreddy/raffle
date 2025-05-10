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
  static async findOneByEmail(email) {
    const payments = await Payment.findOne({
      "payer.email": email,
    }).sort({ _id: -1 }).exec();
    return payments;
  }
  static async findAll(queryData) {
    console.log({ queryData });
    const { page, size, ...query } = queryData;
    const queryParams = {};
    if (query.email) queryParams["payer.email"] = query.email;
    if (query.status) queryParams.status = query.status;
    if (query.raffleId) queryParams.raffleId = query.raffleId;
    const payments = await Payment.find(queryParams)
      .sort({ _id: -1 })
      .skip((page - 1) * size)
      .limit(size)
      .exec();
    return payments;
  }
  static async findOne(params) {
    const payment = await Payment.findOne(params).exec();
    return payment;
  }

  static async countUserTickets(raffleId, email, nationalId) {
    // Look for approved payments by this user (email or nationalId) for this raffle
    const userPayments = await Payment.find({
      raffleId,
      status: 'approved',
      $or: [
        { 'payer.email': email },
        { 'payer.nationalId': nationalId }
      ]
    }).exec();
    
    // Calculate total tickets purchased
    let totalTickets = 0;
    userPayments.forEach(payment => {
      totalTickets += payment.quantity || 0;
    });
    
    return totalTickets;
  }
}
