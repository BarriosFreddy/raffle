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
    type: String,
    required: true
  },
  payer: payerSchema,
  ticketNumbers: [{ type: Number }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  paymentDetails: {
    collection_id: String,
    collection_status: String,
    payment_id: String,
    status: String,
    external_reference: String,
    payment_type: String,
    merchant_order_id: String,
    preference_id: String,
    site_id: String,
    processing_mode: String,
    merchant_account_id: String
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