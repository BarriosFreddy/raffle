import { Raffle } from '../models/raffle.js';
import { ApiError } from '../utils/ApiError.js';

export async function assignTicketNumbers(raffle, participantId, quantity) {
  const participant = raffle.participants.id(participantId);
  if (!participant) {
    throw new ApiError(404, 'Participant not found');
  }

  const availableNumbers = Array.from(
    { length: raffle.maxNumber - raffle.minNumber + 1 },
    (_, i) => i + raffle.minNumber
  ).filter(num => !raffle.selectedNumbers.includes(num));

  if (availableNumbers.length < quantity) {
    throw new ApiError(400, 'Not enough available numbers');
  }

  const selectedNumbers = [];
  for (let i = 0; i < quantity; i++) {
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    selectedNumbers.push(availableNumbers[randomIndex]);
    availableNumbers.splice(randomIndex, 1);
  }

  participant.paymentStatus = 'completed';
  participant.ticketNumbers = selectedNumbers;
  raffle.selectedNumbers.push(...selectedNumbers);

  await raffle.save();
  return selectedNumbers;
}