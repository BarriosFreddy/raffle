import React, { useEffect } from "react";
import { RaffleCard } from "./components/RaffleCard";
import { Link } from "react-router-dom";
import { getRaffles } from "./services/raffle.service";
import { useRaffleStore } from "./store/raffleStore";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  const { raffles, setRaffles } = useRaffleStore();
  useEffect(() => {
    (async () => {
      const rafflesData = await getRaffles()
      setRaffles(rafflesData)
    })()
  }, [])

  return (
    <ErrorBoundary>

      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {raffles.map((raffle) => (
              <Link key={raffle.id} to={"raffle/" + raffle._id}>
                <div
                  className="cursor-pointer touch-manipulation"
                >
                  <RaffleCard
                    raffle={raffle}
                  />
                </div>
              </Link>
            ))}
            {raffles.length === 0 && (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">
                  No hay rifas aún
                </h3>
              </div>
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
