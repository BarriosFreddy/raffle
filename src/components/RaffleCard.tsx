import React from 'react';
import { Gift, Users, Trophy, Hash, CreditCard } from 'lucide-react';
import type { Raffle } from '../types';
import { formatTicketNumber } from '../utils/formatNumber';

interface RaffleCardProps {
  raffle: Raffle;
  onDrawWinner: (raffleId: string) => void;
  isAdmin: boolean;
}

export function RaffleCard({ raffle, onDrawWinner, isAdmin }: RaffleCardProps) {
  const isActive = raffle.status === 'active';
  const totalTickets = raffle.maxNumber - raffle.minNumber + 1;
  const soldTickets = raffle.selectedNumbers.length;
  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(raffle.ticketPrice);
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl active:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">{raffle.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {isActive ? 'Active' : 'Completed'}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4">{raffle.description}</p>
      
      <div className="space-y-4">
        <div className="flex items-center text-gray-700">
          <Gift className="w-6 h-6 mr-3" />
          <span className="text-base">{raffle.prize}</span>
        </div>
        

        <div className="flex items-center text-gray-700">
          <CreditCard className="w-6 h-6 mr-3" />
          <span className="text-base">Price per ticket: {formattedPrice}</span>
        </div>
        
        {raffle.winners.length > 0 && (
          <div className="flex items-center text-gray-700">
            <Trophy className="w-6 h-6 mr-3" />
            <span className="text-base">
              Winner: {raffle.winners[0].name} (Number: {formatTicketNumber(raffle.winners[0].ticketNumbers[0], raffle.maxNumber)})
            </span>
          </div>
        )}
      </div>
      
      {isAdmin && isActive && raffle.selectedNumbers.length > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDrawWinner(raffle.id);
          }}
          className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          Draw Winner
        </button>
      )}
    </div>
  );
}