import { create } from 'zustand';
import type { Raffle, Participant } from '../types';

interface RaffleStore {
  raffles: Raffle[];
  addRaffle: (raffle: Omit<Raffle, 'id' | 'participants' | 'winners' | 'status' | 'selectedNumbers'>) => void;
  addParticipant: (raffleId: string, participant: Omit<Participant, 'id' | 'paymentStatus'>) => void;
  handlePaymentSuccess: (raffleId: string, participantId: string, quantity: number) => void;
  drawWinner: (raffleId: string) => void;
}

export const useRaffleStore = create<RaffleStore>((set) => ({
  raffles: [
    {
      title: 'Rifa 1',
      description: 'Description of the Raffle',
      prize: 'IPHONE',
      minNumber: 1,
      maxNumber: 10000,
      ticketPrice: 3000,
      id: '4612dbce-7d42-4c09-aee4-a82dc8a676d1',
      participants: [],
      winners: [],
      status: 'active',
      selectedNumbers: [],
    },
  ],
  
  addRaffle: (raffleData) => set((state) => ({
    raffles: [...state.raffles, {
      ...raffleData,
      id: crypto.randomUUID(),
      participants: [],
      winners: [],
      status: 'active',
      selectedNumbers: [],
    }],
  })),

  addParticipant: (raffleId, participantData) => set((state) => ({
    raffles: state.raffles.map((raffle) =>
      raffle.id === raffleId
        ? {
            ...raffle,
            participants: [...raffle.participants, {
              ...participantData,
              id: crypto.randomUUID(),
              paymentStatus: 'pending',
              ticketNumbers: [],
            }],
          }
        : raffle
    ),
  })),

  handlePaymentSuccess: (raffleId, participantId, quantity) => set((state) => ({
    raffles: state.raffles.map((raffle) => {
      if (raffle.id !== raffleId) return raffle;

      const availableNumbers = Array.from(
        { length: raffle.maxNumber - raffle.minNumber + 1 },
        (_, i) => i + raffle.minNumber
      ).filter((num) => !raffle.selectedNumbers.includes(num));

      const selectedNumbers: number[] = [];
      for (let i = 0; i < quantity; i++) {
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        selectedNumbers.push(availableNumbers[randomIndex]);
        availableNumbers.splice(randomIndex, 1);
      }

      return {
        ...raffle,
        participants: raffle.participants.map((participant) =>
          participant.id === participantId
            ? {
                ...participant,
                paymentStatus: 'completed',
                ticketNumbers: selectedNumbers,
              }
            : participant
        ),
        selectedNumbers: [...raffle.selectedNumbers, ...selectedNumbers],
      };
    }),
  })),

  drawWinner: (raffleId) => set((state) => ({
    raffles: state.raffles.map((raffle) => {
      if (raffle.id !== raffleId) return raffle;

      const completedParticipants = raffle.participants.filter(
        (p) => p.paymentStatus === 'completed'
      );

      const allPaidTickets = completedParticipants.flatMap(
        (p) => p.ticketNumbers
      );

      const winningNumber =
        allPaidTickets[Math.floor(Math.random() * allPaidTickets.length)];

      const winner = completedParticipants.find((participant) =>
        participant.ticketNumbers.includes(winningNumber)
      );

      if (!winner) return raffle;

      return {
        ...raffle,
        winners: [winner],
        status: 'completed',
      };
    }),
  })),
}));