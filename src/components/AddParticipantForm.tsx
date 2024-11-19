import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, AlertCircle, Shuffle, ShoppingCart } from 'lucide-react';
import type { Participant, Raffle } from '../types';
import { ParticipantDetailsForm } from './ParticipantDetailsForm';
import { formatTicketNumber } from '../utils/formatNumber';

interface AddParticipantFormProps {
  raffle: Raffle;
  onAdd: (participant: Omit<Participant, 'id'>) => void;
}

const NUMBERS_PER_PAGE = 20;
const MIN_TICKETS_REQUIRED = 3;

export function AddParticipantForm({ raffle, onAdd }: AddParticipantFormProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetails, setShowDetails] = useState(false);

  const availableNumbers = useMemo(() => 
    Array.from(
      { length: raffle.maxNumber - raffle.minNumber + 1 },
      (_, i) => i + raffle.minNumber
    ).filter(num => !raffle.selectedNumbers.includes(num)),
    [raffle.minNumber, raffle.maxNumber, raffle.selectedNumbers]
  );

  const filteredNumbers = useMemo(() => {
    if (!searchQuery) return availableNumbers;
    const formattedQuery = searchQuery.padStart(raffle.maxNumber.toString().length, '0');
    return availableNumbers.filter(num => 
      formatTicketNumber(num, raffle.maxNumber).includes(formattedQuery)
    );
  }, [availableNumbers, searchQuery, raffle.maxNumber]);

  const totalPages = Math.ceil(filteredNumbers.length / NUMBERS_PER_PAGE);
  const paginatedNumbers = filteredNumbers.slice(
    (currentPage - 1) * NUMBERS_PER_PAGE,
    currentPage * NUMBERS_PER_PAGE
  );

  const totalPrice = selectedNumbers.length * raffle.ticketPrice;
  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(totalPrice);

  const handleAddNumber = (number: number) => {
    if (!selectedNumbers.includes(number)) {
      setSelectedNumbers(prev => [...prev, number]);
      setSearchQuery('');
    }
  };

  const handleRemoveNumber = (number: number) => {
    setSelectedNumbers(prev => prev.filter(n => n !== number));
  };

  const handleRandomNumber = () => {
    const availableForRandom = availableNumbers.filter(
      num => !selectedNumbers.includes(num)
    );
    if (availableForRandom.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableForRandom.length);
      handleAddNumber(availableForRandom[randomIndex]);
    }
  };

  const handleSubmitDetails = (name: string, email: string, phone: string) => {
    onAdd({
      name,
      email,
      phone,
      ticketNumbers: selectedNumbers
    });
    setSelectedNumbers([]);
    setSearchQuery('');
    setCurrentPage(1);
    setShowDetails(false);
  };

  const remainingTickets = MIN_TICKETS_REQUIRED - selectedNumbers.length;

  if (showDetails) {
    return (
      <ParticipantDetailsForm
        selectedNumbers={selectedNumbers}
        totalPrice={totalPrice}
        onSubmit={handleSubmitDetails}
        onBack={() => setShowDetails(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-base font-medium text-gray-700">
            Available Numbers
          </label>
          <span className="text-sm text-gray-500">
            Minimum {MIN_TICKETS_REQUIRED} tickets required
          </span>
        </div>
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search for a number..."
              className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="button"
            onClick={handleRandomNumber}
            className="inline-flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 active:bg-blue-200 transition-colors"
          >
            <Shuffle className="h-5 w-5 mr-2" />
            Elegir a la suerte
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2 mb-4">
          {paginatedNumbers.map(number => (
            <button
              key={number}
              type="button"
              onClick={() => handleAddNumber(number)}
              disabled={selectedNumbers.includes(number)}
              className={`p-3 text-center rounded-lg transition-colors ${
                selectedNumbers.includes(number)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 active:bg-blue-200'
              }`}
            >
              {formatTicketNumber(number, raffle.maxNumber)}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-base font-medium text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-base font-medium text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400"
          >
            Next
            <ChevronRight className="h-5 w-5 ml-1" />
          </button>
        </div>
      </div>

      {selectedNumbers.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <ShoppingCart className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Your Cart</h3>
            </div>
            <span className="text-lg font-bold text-blue-600">{formattedPrice}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedNumbers.sort((a, b) => a - b).map(number => (
              <span
                key={number}
                className="inline-flex items-center px-4 py-2 rounded-lg text-base bg-blue-100 text-blue-800"
              >
                {formatTicketNumber(number, raffle.maxNumber)}
                <button
                  type="button"
                  onClick={() => handleRemoveNumber(number)}
                  className="ml-2 text-blue-600 hover:text-blue-800 p-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Price per ticket: {new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP'
            }).format(raffle.ticketPrice)}
          </div>
        </div>
      )}

      {remainingTickets > 0 && (
        <div className="flex items-center space-x-3 text-amber-600 bg-amber-50 p-4 rounded-lg">
          <AlertCircle className="h-6 w-6 flex-shrink-0" />
          <span className="text-base">
            Please select {remainingTickets} more ticket{remainingTickets > 1 ? 's' : ''} to continue
          </span>
        </div>
      )}

      <button
        type="button"
        disabled={selectedNumbers.length < MIN_TICKETS_REQUIRED}
        onClick={() => setShowDetails(true)}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:bg-gray-400"
      >
        Continue ({selectedNumbers.length}/{MIN_TICKETS_REQUIRED} tickets selected)
      </button>
    </div>
  );
}