import React from 'react';
import { Gift, Users, Hash, CreditCard } from 'lucide-react';
import type { Raffle } from '../types';

interface RaffleDetailsProps {
  raffle: Raffle;
}

export function RaffleDetails({ raffle }: RaffleDetailsProps) {
  const totalTickets = raffle.maxNumber - raffle.minNumber + 1;
  const soldTickets = raffle.selectedNumbers.length;
  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(raffle.ticketPrice);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mt-6">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${(soldTickets / totalTickets) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}