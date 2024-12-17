import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Participant, Raffle } from '../../types';
import { formatTicketNumber } from '../../utils/formatNumber';

interface PurchaseInfo extends Participant {
  raffleTitle: string;
  ticketPrice: number;
}

interface PurchasesListProps {
  payments: any;
}

export function PurchasesList({ payments }: PurchasesListProps) {
  const [expandedPurchase, setExpandedPurchase] = useState<string | null>(null);


  const toggleExpand = (id: string) => {
    setExpandedPurchase(current => current === id ? null : id);
  };

  if (payments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No hay compras aún.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map(payment => {
        const isExpanded = expandedPurchase === payment._id;
        return (
          <div
            key={payment._id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleExpand(payment._id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-900">{payment.payer.name}</span>
                  <span className="text-sm text-gray-600">
                    {payment.ticketNumbers.length} tickets
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>{payment.raffleTitle}</span>
                  <span>
                    {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP'
                    }).format(payment.amount)}
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
                    <dd className="text-gray-900">{payment.payer.email}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Phone:</dt>
                    <dd className="text-gray-900">{payment.payer.phone}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Instagram:</dt>
                    <dd className="text-gray-900">{payment.payer.instagram}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">National ID:</dt>
                    <dd className="text-gray-900">{payment.payer.nationalId}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-600 mb-2">Ticket Numbers:</dt>
                    <dd className="flex flex-wrap gap-2">
                      {payment.ticketNumbers.map(number => (
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