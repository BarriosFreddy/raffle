import mongoose from 'mongoose';

const raffleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  prize: { type: String, required: true },
  minNumber: { type: Number, required: true },
  maxNumber: { type: Number, required: true },
  ticketPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  selectedNumbers: [{ type: Number }],
}, { timestamps: true });

export const Raffle = mongoose.model('Raffle', raffleSchema);