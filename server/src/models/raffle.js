import mongoose from 'mongoose';

const raffleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  prize: { type: String, required: true },
  minNumber: { type: Number, required: true },
  maxNumber: { type: Number, required: true },
  ticketPrice: { type: Number, required: true },
  minTicketsPerUser: { type: Number, default: 1, required: true },
  maxTicketsPerUser: { type: Number, default: 100, required: true },
  slug: { 
    type: String, 
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9-]+$/, // Only letters, numbers and dashes allowed
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  },
  statusMessage: {
    type: String,
    default: ''
  },
  paymentGateway: {
    type: String,
    enum: ['EPAYCO', 'MP', 'BOLD', 'NONE', 'OPEN_PAY'],
    default: 'BOLD',
    required: true
  },
  selectedNumbers: [{ type: Number }], //deprecated
  selectedNumbersQuantity: {
    type: Number,
    default: 0
  },
  awardedNumbers: [{ type: Number }], // Numbers that have been awarded prizes
  blockedNumbers: [{ type: Number }], // Numbers that are blocked from being assigned
  unblockedAwardedNumbers: [{ type: Number }], // Awarded numbers that are unblocked and ready to be assigned
  themeColor: {
    type: String,
    default: '#4f46e5'
  },
  coverUrl: {
    type: String,
    default: ''
  },
  lotteryName: {
    type: String,
    default: ''
  },
  supportPhoneNumber: {
    type: String,
    match: /^\+?[0-9]{10,15}$/, // Phone number with optional + prefix, 10-15 digits
    default: ''
  }
}, { timestamps: true });

export const Raffle = mongoose.model('Raffle', raffleSchema);