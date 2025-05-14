import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TicketContainer } from "../TicketContainer";
import { Raffle } from "@/types";
import dayjs from "dayjs";


interface PurchasesListProps {
  payments: any;
  onNext: () => void;
  onPrev: () => void;
  page: number;
  raffle: Raffle;
}

export function PurchasesList({
  payments,
  onNext,
  onPrev,
  page,
  raffle,
}: PurchasesListProps) {
  const [expandedPurchase, setExpandedPurchase] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedPurchase((current) => (current === id ? null : id));
  };

  const handlePrevPage = async () => onPrev && onPrev();

  const handleNextPage = async () => onNext && onNext();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Compras recientes
        </h2>
        <div className="space-y-4">
          {payments.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              No hay compras aún.
            </div>
          )}
          {payments.map((payment) => {
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
                      <span className="font-medium text-gray-900">
                        {payment.payer.name}
                      </span>
                      <span className="text-sm text-gray-600">
                        {payment.ticketNumbers.length} tickets
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>{payment.raffleTitle}</span>
                      <span>
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
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
                    <div className="space-y-2 text-sm">
                      <div className="flex gap-2">
                        <dt className="text-gray-600">Email:</dt>
                        <dd className="text-gray-900">{payment.payer.email}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-gray-600">Phone:</dt>
                        <dd className="text-gray-900">{payment.payer.phone}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-gray-600">National ID:</dt>
                        <dd className="text-gray-900">
                          {payment.payer.nationalId}
                        </dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-gray-600">Fecha:</dt>
                        <dd className="text-gray-900">
                          {dayjs(payment.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                        </dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-gray-600">Id del evento:</dt>
                        <dd className="text-gray-900">
                          {payment.raffle._id.substring(0, 6)}
                        </dd>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-2">Ticket Numbers:</div>
                      <div className="flex flex-wrap gap-2">
                        {payment.ticketNumbers.map((number) => (
                          <TicketContainer
                            key={number}
                            ticketNumber={number}
                            digits={
                              raffle
                                ? raffle.maxNumber.toString().length - 1
                                : 0
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-8">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="rounded-md border border-slate-300 p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <p className="text-slate-600">
          Page <strong className="text-slate-800">{page}</strong> &nbsp;
        </p>

        <button
          onClick={handleNextPage}
          className="rounded-md border border-slate-300 p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
