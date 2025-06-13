import { Payment } from "../models/payment.js";
import axios from "axios";
import dotenv from "dotenv";
// Load environment variables
dotenv.config();
const {
  BOLD_API_KEY,
  MP_ACCESS_TOKEN,
  OPENPAY_MERCHANT_ID,
  OPENPAY_API_SECRET,
  OPENPAY_API_URL,
} = process.env;

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
    }).exec();
    return payments;
  }
  static async findAll(queryData) {
    const { page, size, search, ...query } = queryData;
    const queryParams = {};
    
    // Standard filters
    if (query.email) queryParams["payer.email"] = query.email;
    if (Array.isArray(query.status)) queryParams.status = { $in: query.status };
    if (!Array.isArray(query.status)) queryParams.status = query.status;
    if (query.raffleId) queryParams.raffleId = query.raffleId;
    
    // Global case-insensitive search if provided
    if (search) {
      const searchRegex = new RegExp(`.*${search}.*`, 'i');
      queryParams['$or'] = [  
        { 'payer.email': searchRegex },
        { 'payer.phone': searchRegex },
        { 'payer.nationalId': searchRegex },
        { 'payer.name': searchRegex },
      ];
      if(Number.isInteger(Number(search)))
      { queryParams['$or'].push({ 'ticketNumbers': search }) }
    }
    
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
      status: "approved",
      $or: [{ "payer.email": email }, { "payer.nationalId": nationalId }],
    }).exec();

    // Calculate total tickets purchased
    let totalTickets = 0;
    userPayments.forEach((payment) => {
      totalTickets += payment.quantity || 0;
    });

    return totalTickets;
  }
  static async getAwardedNumbersWinners(raffleId, awardedNumbers = []) {
    const userPaymentsWinners = await Payment.find({
      raffleId,
      ticketNumbers: {
        $in: awardedNumbers,
      },
    }).exec();
    return userPaymentsWinners;
  }
  static async getBoldRecordByOrderId(orderId) {
    try {
      if (!orderId) return;

      const response = await axios.get(
        `https://payments.api.bold.co/v2/payment-voucher/${orderId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `x-api-key ${BOLD_API_KEY}`,
          },
        }
      );
      const { data, status } = response;
      console.info("Bold Record Response", { status, data });
      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  static async getOpenPayRecordByOrderId(orderId) {
    try {
      if (!orderId) return;

      const url = `${OPENPAY_API_URL}/${OPENPAY_MERCHANT_ID}/charges?order_id=${orderId}`;

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: OPENPAY_API_SECRET,
          password: "",
        },
      });
      const { data, status } = response;
      console.info("OpenPay Record Response", { status, data });
      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  static async getMercadoPagoPaymentByOrderId(orderId) {
    try {
      if (!orderId) return;

      const response = await axios.get(
        `https://api.mercadopago.com/v1/payments/search?external_reference=${orderId}&sort=date_approved&criteria=desc&range=date_created`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
          },
        }
      );
      const { data, status } = response;
      console.info("Mercado Pago Payment Response", { status, data });
      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
