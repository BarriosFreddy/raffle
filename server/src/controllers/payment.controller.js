import { Raffle } from "../models/raffle.js";
import { ApiError } from "../utils/ApiError.js";
import { TicketService } from "../services/ticket.service.js";
import { PaymentService } from "../services/payment.service.js";
import { MercadoPagoService } from "../services/mercadopago.service.js";

const APPROVED = "approved";
const REJECTED = "rejected";
const PENDING = "pending";

export const paymentController = {
  async createPayment(req, res, next) {
    try {
      const payment = req.body;
      const { raffleId, payer, quantity } = payment;
      
      // Get the raffle to check maxTicketsPerUser
      const raffle = await Raffle.findById(raffleId);
      if (!raffle) {
        return next(new ApiError(404, "Raffle not found"));
      }
      
      // Count existing tickets for this user
      const existingTickets = await PaymentService.countUserTickets(
        raffleId, 
        payer.email, 
        payer.nationalId
      );
      
      // Check if user is trying to exceed maximum allowed tickets
      const maxTicketsPerUser = raffle.maxTicketsPerUser || 100;
      const totalTickets = existingTickets + quantity;
      
      if (totalTickets > maxTicketsPerUser) {
        return next(new ApiError(400, `Excede el límite máximo de ${maxTicketsPerUser} tickets por usuario. Ya has comprado ${existingTickets} tickets.`));
      }
      
      const paymentSaved = await PaymentService.create(payment);
      res.status(201).json(paymentSaved);
    } catch (error) {
      console.error(error);
      next(new ApiError(400, "Failed to create payment record"));
    }
  },
  async findByPreferenceId(req, res, next) {
    try {
      const { preferenceId } = req.params;
      const payment = await PaymentService.findByPreferenceId(preferenceId);
      res.status(200).json(payment);
    } catch (error) {
      console.error(error);
      next(new ApiError(400, "Failed to create payment record"));
    }
  },
  async findAll(req, res, next) {
    try {
      const { email, status, raffleId, page = 1, size = 10 } = req.query;
      const payments = await PaymentService.findAll({
        raffleId,
        email,
        status,
        raffleId,
        page,
        size,
      });
      res.status(200).json(payments);
    } catch (error) {
      console.error(error);
      next(new ApiError(400, "Failed to fetch payment record"));
    }
  },
  async findByEmail(req, res, next) {
    try {
      const { email } = req.params;
      const payments = await PaymentService.findAll({ email });
      res.status(200).json(payments);
    } catch (error) {
      console.error(error);
      next(new ApiError(400, "Failed to create payment record"));
    }
  },

  async handlePaymentWebhook(req, res, next) {
    try {
      const paymentInfo = req.body;
      const { preference_id, payment_id, x_customer_email, boldOrderId, boldTXStatus } = paymentInfo;
      let payment;
      let newStatus;
      let paymentDetails;

      if (payment_id && !preference_id) {
        const mpPayment = await MercadoPagoService.findPaymentById(payment_id);
        const {
          id: mpPaymentId,
          status,
          additional_info: {
            payer: {
              phone: { number: phoneNumber },
              identification: { number: identificationNumber } = {},
            } = {},
          } = {},
        } = mpPayment || {};
        if (status === APPROVED) {
          payment = await PaymentService.findOne({
            $or: [
              { "payer.phone": phoneNumber, status: PENDING },
              { mpPaymentId: mpPaymentId.toString() },
            ],
          });
          newStatus = APPROVED;
          paymentDetails = mpPayment;
          payment.mpPaymentId = mpPaymentId.toString();
        }
      } else if (preference_id) {
        payment = await PaymentService.findOne({
          preferenceId: preference_id,
        });
        newStatus = paymentInfo.status;
        paymentDetails = paymentInfo;
      } else if (x_customer_email) {
        payment = await PaymentService.findOneByEmail(x_customer_email);
        newStatus = paymentInfo.x_cod_response === 1 ? APPROVED : REJECTED;
        paymentDetails = paymentInfo;
      } else if (boldOrderId && boldTXStatus) {
        payment = await PaymentService.findOne({
          orderId: boldOrderId,
        });
        newStatus = boldTXStatus === "approved" ? APPROVED : REJECTED;
        paymentDetails = paymentInfo;
      }
      if (!payment) {
        return next(new ApiError(404, "Payment record not found"));
      }
      if ([APPROVED, REJECTED].includes(payment.status)) {
        console.info("El pago ya fue procesado!");
        return res.status(200).json(payment);
      }
      if (newStatus && paymentDetails) {
        // Update payment details
        payment.paymentDetails = paymentDetails;
        payment.status = newStatus === APPROVED ? APPROVED : REJECTED;
        await payment.save();
      }
      res.json(payment);
    } catch (e) {
      console.error(e);
      next(new ApiError(400, "Failed to process payment webhook"));
    }
  },
  async getBoldRecordByOrderId(req, res, next) {
    try {
      const { boldOrderId } = req.params;
      const boldRecord = await PaymentService.getBoldRecordByOrderId(boldOrderId);
      res.status(200).json(boldRecord);
    } catch (e) {
      console.error(e);
      next(new ApiError(400, "Failed to get bold record by order id"));
    }
  },
  async handleAssignTicketNumbers(req, res, next) {
    try {
      const { preferenceId, email } = req.body;
      let payment =
        preferenceId && (await PaymentService.findByPreferenceId(preferenceId));
      if (email) payment = await PaymentService.findOneByEmail(email);
      if (!payment) {
        return next(new ApiError(404, "Payment record not found"));
      }

      // If payment is approved, assign ticket numbers
      console.log({ preferenceId, ticketNumbers: payment.ticketNumbers });
      if (payment.status === APPROVED && !payment.ticketNumbers?.length) {
        payment = await TicketService.assignTicketNumbers(
          payment._id,
          payment.quantity
        );
        if (!payment) {
          res.status(400).json({
            error: {
              message:
                "There was not possible to assign the ticket numbers. Maybe there are not sufficient available numbers to assign.",
            },
          });
        }
      }

      res.json(payment);
    } catch (e) {
      console.error(e);
      next(new ApiError(500, e));
    }
  },

  async getPaymentStatus(req, res, next) {
    try {
      const { preferenceId } = req.params;
      const payment = await Payment.findOne({ preferenceId }).populate(
        "raffleId"
      );

      if (!payment) {
        return next(new ApiError(404, "Payment not found"));
      }

      const response = {
        payment,
        ticketNumbers:
          payment.status === "approved"
            ? payment.raffleId.participants.id(payment.participantId)
                ?.ticketNumbers
            : [],
      };

      res.json(response);
    } catch (e) {
      console.error(e);
      next(new ApiError(500, "Failed to fetch payment status"));
    }
  },
};
