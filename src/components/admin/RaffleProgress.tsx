import React from "react";
import type { Raffle } from "../../types";

interface RaffleProgressProps {
  raffle: Raffle | undefined;
}

export function RaffleProgress({ raffle }: RaffleProgressProps) {
  const totalTickets = (raffle?.maxNumber || 0) - (raffle?.minNumber || 0);
  const soldTickets = raffle?.selectedNumbersQuantity || 0;
  const soldTicketsPercentage = Math.floor((soldTickets * 100) / totalTickets);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">{raffle?.title}</h3>
        <span className="text-sm font-medium text-gray-600">
          {soldTickets} / {totalTickets} tickets
        </span>
      </div>

      <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-500"
          style={{ width: `${soldTicketsPercentage}%` }}
        />
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <span>{soldTicketsPercentage}% vendidos</span>
        <span>{totalTickets - soldTickets} disponibles</span>
      </div>
    </div>
  );
}
