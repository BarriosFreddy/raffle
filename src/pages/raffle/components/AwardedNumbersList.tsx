import React from 'react';
import type { Raffle } from '@/types';
import { Award } from 'lucide-react';

interface AwardedNumbersListProps {
  raffle: Raffle;
}

export function AwardedNumbersList({ raffle }: AwardedNumbersListProps) {
  // If there are no awarded numbers, don't render anything
  if (!raffle.awardedNumbers || raffle.awardedNumbers.length === 0) {
    return null;
  }

  // Sort the awarded numbers for better display
  const sortedNumbers = [...raffle.awardedNumbers].sort((a, b) => a - b);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6 mb-3">
      <div className="flex items-center mb-4">
        <Award className="h-6 w-6 text-yellow-500 mr-2" />
        <h3 className="text-lg font-bold text-gray-800">Números premiados</h3>
      </div>
      
      <p className="text-gray-600 mb-4">
        Aquí están los números premiados que se entregan de forma aleatoria y su pago es inmediato.
      </p>
      
      <div className="flex flex-wrap gap-2 mt-3">
        {sortedNumbers.map(number => (
          <div 
            key={number} 
            className="flex items-center justify-center h-10 min-w-10 px-3 rounded-full bg-yellow-100 text-yellow-800 font-bold"
          >
            {number}
          </div>
        ))}
      </div>
    </div>
  );
}
