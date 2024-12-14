import React from "react";
import { PurchasesList } from "./PurchasesList";
import { RaffleProgress } from "./RaffleProgress";
import { AdminStats } from "./AdminStats";
import type { Raffle } from "../../types";

interface AdminPanelProps {}

export function AdminPanel({}: AdminPanelProps) {
  const raffles: Raffle[] = [];

  return (
    <div className="space-y-6">
      <AdminStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Raffle Progress
          </h2>
          <div className="space-y-6">
            {raffles.map((raffle) => (
              <RaffleProgress key={raffle.id} raffle={raffle} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Recent Purchases
          </h2>
          <PurchasesList raffles={raffles} />
        </div>
      </div>
    </div>
  );
}
