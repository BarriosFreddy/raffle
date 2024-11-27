import React, { useState } from "react";
import { Plus, Ticket, Lock } from "lucide-react";
import type { Raffle, Participant } from "./types";
import { RaffleCard } from "./components/RaffleCard";
import { CreateRaffleForm } from "./components/CreateRaffleForm";
import { AddParticipantForm } from "./components/AddParticipantForm";
import { PurchaseSearch } from "./components/PurchaseSearch";
import { AdminLogin } from "./components/AdminLogin";
import { AdminPanel } from "./components/admin/AdminPanel";
import { Link } from "react-router-dom";

export default function App() {
  const [raffles, setRaffles] = useState<Raffle[]>([
    {
      title: "Rifa 1",
      description: "Description of the Raffle",
      prize: "IPHONE",
      minNumber: 1,
      maxNumber: 10000,
      ticketPrice: 3000,
      id: "4612dbce-7d42-4c09-aee4-a82dc8a676d1",
      participants: [],
      winners: [],
      status: "active",
      selectedNumbers: [],
    },
  ]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedRaffle, setSelectedRaffle] = useState<string | null>(null);
  const [showPurchaseSearch, setShowPurchaseSearch] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleCreateRaffle = (
    raffleData: Omit<
      Raffle,
      | "id"
      | "participants"
      | "winners"
      | "status"
      | "selectedNumbers"
      | "ticketPrice"
    >
  ) => {
    if (!isAdmin) return;

    const newRaffle: Raffle = {
      ...raffleData,
      ticketPrice: 3000,
      id: crypto.randomUUID(),
      participants: [],
      winners: [],
      status: "active",
      selectedNumbers: [],
    };
    setRaffles((prev) => [...prev, newRaffle]);
    setShowCreateForm(false);
  };

  const handleAddParticipant = (
    participantData: Omit<Participant, "id" | "paymentStatus">
  ) => {
    if (!selectedRaffle) return;

    const newParticipant: Participant = {
      ...participantData,
      id: crypto.randomUUID(),
      paymentStatus: "pending",
      ticketNumbers: [], // Numbers will be assigned after payment
    };

    setRaffles((prev) =>
      prev.map((raffle) =>
        raffle.id === selectedRaffle
          ? {
              ...raffle,
              participants: [...raffle.participants, newParticipant],
            }
          : raffle
      )
    );
    setSelectedRaffle(null);
  };

  const handlePaymentSuccess = (
    raffleId: string,
    participantId: string,
    quantity: number
  ) => {
    setRaffles((prev) =>
      prev.map((raffle) => {
        if (raffle.id !== raffleId) return raffle;

        const availableNumbers = Array.from(
          { length: raffle.maxNumber - raffle.minNumber + 1 },
          (_, i) => i + raffle.minNumber
        ).filter((num) => !raffle.selectedNumbers.includes(num));

        const selectedNumbers: number[] = [];
        for (let i = 0; i < quantity; i++) {
          const randomIndex = Math.floor(
            Math.random() * availableNumbers.length
          );
          selectedNumbers.push(availableNumbers[randomIndex]);
          availableNumbers.splice(randomIndex, 1);
        }

        return {
          ...raffle,
          participants: raffle.participants.map((participant) =>
            participant.id === participantId
              ? {
                  ...participant,
                  paymentStatus: "completed",
                  ticketNumbers: selectedNumbers,
                }
              : participant
          ),
          selectedNumbers: [...raffle.selectedNumbers, ...selectedNumbers],
        };
      })
    );
  };

  const handleDrawWinner = (raffleId: string) => {
    setRaffles((prev) =>
      prev.map((raffle) => {
        if (raffle.id !== raffleId) return raffle;

        const completedParticipants = raffle.participants.filter(
          (p) => p.paymentStatus === "completed"
        );

        const allPaidTickets = completedParticipants.flatMap(
          (p) => p.ticketNumbers
        );

        const winningNumber =
          allPaidTickets[Math.floor(Math.random() * allPaidTickets.length)];

        const winner = completedParticipants.find((participant) =>
          participant.ticketNumbers.includes(winningNumber)
        );

        if (!winner) return raffle;

        return {
          ...raffle,
          winners: [winner],
          status: "completed",
        };
      })
    );
  };

  const handleAdminLogin = (success: boolean) => {
    setIsAdmin(success);
    setShowAdminLogin(false);
    if (success) {
      setShowAdminPanel(true);
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setShowCreateForm(false);
    setShowAdminPanel(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/*  <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <Ticket className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">
                Raffle
              </h1>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowPurchaseSearch(!showPurchaseSearch);
                  setShowAdminPanel(false);
                  setShowCreateForm(false);
                }}
                className="py-2 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-colors"
              >
                Search My Tickets
              </button>
              {isAdmin ? (
                <>
                  <button
                    onClick={() => {
                      setShowCreateForm(true);
                      setShowPurchaseSearch(false);
                      setShowAdminPanel(false);
                    }}
                    className="flex items-center py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors"
                  >
                    <Plus className="h-5 w-5 mr-1" />
                    Create Raffle
                  </button>
                  <button
                    onClick={() => {
                      setShowAdminPanel(true);
                      setShowPurchaseSearch(false);
                      setShowCreateForm(false);
                    }}
                    className="py-2 px-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800 transition-colors"
                  >
                    Admin Panel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="py-2 px-4 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 active:bg-red-300 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAdminLogin(true)}
                  className="flex items-center py-2 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-colors"
                >
                  <Lock className="h-5 w-5 mr-1" />
                  Admin Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header> */}

      <main className="max-w-7xl mx-auto px-4 py-6">
        {showAdminLogin ? (
          <div className="max-w-lg mx-auto">
            <AdminLogin onLogin={handleAdminLogin} />
          </div>
        ) : showCreateForm ? (
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
        ) : showAdminPanel ? (
          <AdminPanel raffles={raffles} />
        ) : selectedRaffle && raffles.find((r) => r.id === selectedRaffle) ? (
          <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add Participant</h2>
            <AddParticipantForm
              raffle={raffles.find((r) => r.id === selectedRaffle)!}
              onAdd={handleAddParticipant}
              onPaymentSuccess={(participantId, quantity) =>
                handlePaymentSuccess(selectedRaffle, participantId, quantity)
              }
            />
          </div>
        ) : showPurchaseSearch ? (
          <div className="max-w-lg mx-auto">
            <PurchaseSearch raffles={raffles} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {raffles.map((raffle) => (
              <Link key={raffle.id} to={"raffle/" + raffle.id}>
                <div
                  className="cursor-pointer touch-manipulation"
                >
                  <RaffleCard
                    raffle={raffle}
                    onDrawWinner={handleDrawWinner}
                    isAdmin={isAdmin}
                  />
                </div>
              </Link>
            ))}
            {raffles.length === 0 && (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">
                  No raffles yet
                </h3>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
