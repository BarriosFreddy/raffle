import React, { useState } from 'react';
import { Plus, Ticket } from 'lucide-react';
import type { Raffle, Participant } from './types';
import { RaffleCard } from './components/RaffleCard';
import { CreateRaffleForm } from './components/CreateRaffleForm';
import { AddParticipantForm } from './components/AddParticipantForm';

export default function App() {
  const [raffles, setRaffles] = useState<Raffle[]>([
    {
      title: 'Rifa 1',
      description: 'Description of the Raffle',
      prize: 'IPHONE',
      minNumber: 1,
      maxNumber: 10000,
      ticketPrice: 3000,
      id: '4612dbce-7d42-4c09-aee4-a82dc8a676d1',
      participants: [],
      winners: [],
      status: 'active',
      selectedNumbers: [],
    },
  ]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedRaffle, setSelectedRaffle] = useState<string | null>(null);

  const handleCreateRaffle = (
    raffleData: Omit<
      Raffle,
      'id' | 'participants' | 'winners' | 'status' | 'selectedNumbers' | 'ticketPrice'
    >
  ) => {
    const newRaffle: Raffle = {
      ...raffleData,
      ticketPrice: 3000,
      id: crypto.randomUUID(),
      participants: [],
      winners: [],
      status: 'active',
      selectedNumbers: [],
    };
    setRaffles((prev) => [...prev, newRaffle]);
    setShowCreateForm(false);
  };

  const handleAddParticipant = (participantData: Omit<Participant, 'id'>) => {
    if (!selectedRaffle) return;

    const newParticipant: Participant = {
      ...participantData,
      id: crypto.randomUUID(),
    };

    setRaffles((prev) =>
      prev.map((raffle) =>
        raffle.id === selectedRaffle
          ? {
              ...raffle,
              participants: [...raffle.participants, newParticipant],
              selectedNumbers: [
                ...raffle.selectedNumbers,
                ...participantData.ticketNumbers,
              ],
            }
          : raffle
      )
    );
    setSelectedRaffle(null);
  };

  const handleDrawWinner = (raffleId: string) => {
    setRaffles((prev) =>
      prev.map((raffle) => {
        if (raffle.id !== raffleId) return raffle;

        const winningNumber =
          raffle.selectedNumbers[
            Math.floor(Math.random() * raffle.selectedNumbers.length)
          ];

        const winner = raffle.participants.find((participant) =>
          participant.ticketNumbers.includes(winningNumber)
        );

        if (!winner) return raffle;

        return {
          ...raffle,
          winners: [winner],
          status: 'completed',
        };
      })
    );
  };

  const selectedRaffleData = raffles.find((r) => r.id === selectedRaffle);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <Ticket className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">
                Raffle
              </h1>
            </div>
            {!showCreateForm && !selectedRaffle && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Raffle
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {showCreateForm ? (
          <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Create New Raffle</h2>
            <CreateRaffleForm onCreate={handleCreateRaffle} />
            <button
              onClick={() => setShowCreateForm(false)}
              className="mt-4 w-full py-3 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-colors text-base font-medium"
            >
              Cancel
            </button>
          </div>
        ) : selectedRaffle && selectedRaffleData ? (
          <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add Participant</h2>
            <AddParticipantForm
              raffle={selectedRaffleData}
              onAdd={handleAddParticipant}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {raffles.map((raffle) => (
              <div
                key={raffle.id}
                onClick={() =>
                  raffle.status === 'active' && setSelectedRaffle(raffle.id)
                }
                className="cursor-pointer touch-manipulation"
              >
                <RaffleCard raffle={raffle} onDrawWinner={handleDrawWinner} />
              </div>
            ))}
            {raffles.length === 0 && (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">
                  No raffles yet
                </h3>
                <p className="mt-1 text-gray-500">
                  Get started by creating your first raffle!
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}