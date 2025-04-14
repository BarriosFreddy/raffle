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

export async function createRaffle(data) {
  const raffle = new Raffle(data);
  try {
    await raffle.save();
    return raffle;
  } catch (error) {
    throw new ApiError(400, 'Failed to create raffle');
  }
}

export async function getRaffles({page = 1, size = 10, ...query} = {}) {
  const skip = (page - 1) * size;
  return await Raffle.find(query).skip(skip).limit(size).exec();
}

export async function getRaffleById(id) {
  return await Raffle.findById(id).exec();
}

export async function updateRaffle(id, data) {
  const raffle = await Raffle.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!raffle) {
    throw new ApiError(404, 'Raffle not found');
  }
  return raffle;
}

export async function deleteRaffle(id) {
  const raffle = await Raffle.findByIdAndRemove(id);
  if (!raffle) {
    throw new ApiError(404, 'Raffle not found');
  }
  return raffle;
}
