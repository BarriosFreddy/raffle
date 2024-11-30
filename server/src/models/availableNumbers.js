import mongoose from 'mongoose';

const availableNumberSchema = new mongoose.Schema({
  raffleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Raffle',
    required: true
  },
  number: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'taken'],
    default: 'available'
  }
}, { timestamps: true });

export const AvailableNumber = mongoose.model('AvailableNumbers', availableNumberSchema, 'available_numbers');