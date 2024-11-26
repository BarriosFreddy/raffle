import React, { useState } from 'react';
import { Search, Ticket } from 'lucide-react';
import type { Participant, Raffle } from '../types';
import { formatTicketNumber } from '../utils/formatNumber';

interface PurchaseSearchProps {
  raffles: Raffle[];
}

export function PurchaseSearch({ raffles }: PurchaseSearchProps) {
  const [email, setEmail] = useState('');
  const [searchResults, setSearchResults] = useState<{
    raffle: Raffle;
    participant: Participant;
  }[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const results = raffles.flatMap(raffle => 
      raffle.participants
        .filter(participant => participant.email.toLowerCase() === email.toLowerCase())
        .map(participant => ({ raffle, participant }))
    );
    
    setSearchResults(results);
    setSearched(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Search My Tickets</h2>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          Search Tickets
        </button>
      </form>

      {searched && (
        <div className="mt-8">
          {searchResults.length > 0 ? (
            <div className="space-y-6">
              {searchResults.map(({ raffle, participant }, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Ticket className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">{raffle.title}</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Prize: {raffle.prize}</p>
                    <div className="flex flex-wrap gap-2">
                      {participant.ticketNumbers.sort((a, b) => a - b).map(number => (
                        <span
                          key={number}
                          className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                        >
                          {formatTicketNumber(number, raffle.maxNumber)}
                        </span>
                      ))}
                    </div>
                    {raffle.winners.some(winner => winner.id === participant.id) && (
                      <p className="text-green-600 font-semibold mt-2">
                        🎉 Winner!
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No tickets found for this email.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}