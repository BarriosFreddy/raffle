import mongoose from 'mongoose';

const raffleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  prize: { type: String, required: true },
  minNumber: { type: Number, required: true },
  maxNumber: { type: Number, required: true },
  ticketPrice: { type: Number, required: true },
  slug: { 
    type: String, 
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9-]+$/, // Only letters, numbers and dashes allowed
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  paymentGateway: {
    type: String,
    enum: ['EPAYCO', 'MP', 'BOLD'],
    default: 'EPAYCO',
    required: true
  },
  selectedNumbers: [{ type: Number }], //deprecated
  selectedNumbersQuantity: {
    type: Number,
    default: 0
  },
  awardedNumbers: [{ type: Number }], // Numbers that have been awarded prizes
  themeColor: {
    type: String,
    default: '#4f46e5'
  },
  coverUrl: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export const Raffle = mongoose.model('Raffle', raffleSchema);