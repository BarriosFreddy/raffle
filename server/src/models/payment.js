import mongoose from 'mongoose';

const payerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  instagram: { type: String, required: true },
  nationalId: { type: String },
}, { timestamps: true });


const paymentSchema = new mongoose.Schema({
  raffleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Raffle',
    required: true
  },
  preferenceId: {
    type: String
  },
  orderId: {
    type: String
  },
  payer: payerSchema,
  ticketNumbers: [{ type: Number }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  paymentDetails: {
    type: mongoose.Schema.Types.Mixed,
  },
  mpPaymentId: {
    type: String,
  },
  amount: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
}, { timestamps: true });

export const Payment = mongoose.model('Payment', paymentSchema);