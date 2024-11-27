import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Participant, Raffle } from '../../types';
import { formatTicketNumber } from '../../utils/formatNumber';

interface PurchaseInfo extends Participant {
  raffleTitle: string;
  ticketPrice: number;
}

interface PurchasesListProps {
  raffles: Raffle[];
}

export function PurchasesList({ raffles }: PurchasesListProps) {
  const [expandedPurchase, setExpandedPurchase] = useState<string | null>(null);

  const purchases: PurchaseInfo[] = raffles.flatMap(raffle =>
    raffle.participants
      .filter(p => p.paymentStatus === 'completed')
      .map(participant => ({
        ...participant,
        raffleTitle: raffle.title,
        ticketPrice: raffle.ticketPrice
      }))
  ).sort((a, b) => b.ticketNumbers.length - a.ticketNumbers.length);

  const toggleExpand = (id: string) => {
    setExpandedPurchase(current => current === id ? null : id);
  };

  if (purchases.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No purchases have been made yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {purchases.map(purchase => {
        const isExpanded = expandedPurchase === purchase.id;
        const totalAmount = purchase.ticketNumbers.length * purchase.ticketPrice;

        return (
          <div
            key={purchase.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleExpand(purchase.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-900">{purchase.name}</span>
                  <span className="text-sm text-gray-600">
                    {purchase.ticketNumbers.length} tickets
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>{purchase.raffleTitle}</span>
                  <span>
                    {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP'
                    }).format(totalAmount)}
                  </span>
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-400 ml-4" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400 ml-4" />
              )}
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 bg-gray-50">
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Email:</dt>
                    <dd className="text-gray-900">{purchase.email}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Phone:</dt>
                    <dd className="text-gray-900">{purchase.phone}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Instagram:</dt>
                    <dd className="text-gray-900">{purchase.instagram}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">National ID:</dt>
                    <dd className="text-gray-900">{purchase.nationalId}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-600 mb-2">Ticket Numbers:</dt>
                    <dd className="flex flex-wrap gap-2">
                      {purchase.ticketNumbers.map(number => (
                        <span
                          key={number}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                        >
                          {formatTicketNumber(number, 99999)}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}