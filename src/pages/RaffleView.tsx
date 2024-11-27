import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useRaffleStore } from '../store/raffleStore';
import { AddParticipantForm } from '../components/AddParticipantForm';
import type { Participant } from '../types';

export function RaffleView() {
  const { raffleId } = useParams<{ raffleId: string }>();
  const { raffles, addParticipant, handlePaymentSuccess } = useRaffleStore();
  const raffle = raffles.find(r => r.id === raffleId);

  if (!raffle) {
    return <Navigate to="/" replace />;
  }

  if (raffle.status !== 'active') {
    return (
      <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Raffle Closed</h2>
        <p className="text-gray-600">
          This raffle is no longer active. The winner has been drawn.
        </p>
        {raffle.winners.length > 0 && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800">Winner</h3>
            <p className="text-green-700">{raffle.winners[0].name}</p>
          </div>
        )}
      </div>
    );
  }

  const handleAddParticipant = (participantData: Omit<Participant, 'id' | 'paymentStatus'>) => {
    addParticipant(raffle.id, participantData);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mt-8">
        <AddParticipantForm
          raffle={raffle}
          onAdd={handleAddParticipant}
          onPaymentSuccess={(participantId, quantity) => 
            handlePaymentSuccess(raffle.id, participantId, quantity)
          }
        />
      </div>
    </div>
  );
}