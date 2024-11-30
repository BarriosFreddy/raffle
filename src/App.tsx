import React, { useEffect, useState } from "react";
import { Plus, Ticket, Lock } from "lucide-react";
import type { Raffle, Participant } from "./types";
import { RaffleCard } from "./components/RaffleCard";
import { CreateRaffleForm } from "./components/CreateRaffleForm";
import { AddParticipantForm } from "./components/AddParticipantForm";
import { PurchaseSearch } from "./pages/PurchaseSearch";
import { AdminLogin } from "./components/AdminLogin";
import { AdminPanel } from "./components/admin/AdminPanel";
import { Link } from "react-router-dom";
import { getRaffles } from "./services/raffle.service";
import { useRaffleStore } from "./store/raffleStore";

export default function App() {
  const { raffles, setRaffles  } = useRaffleStore();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedRaffle, setSelectedRaffle] = useState<string | null>(null);
  const [showPurchaseSearch, setShowPurchaseSearch] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    (async ()=> {
     const rafflesData = await getRaffles()
     setRaffles(rafflesData)
    })()
  }, [])

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
    setSelectedRaffle(null);
  };

  const handlePaymentSuccess = (
    raffleId: string,
    participantId: string,
    quantity: number
  ) => {

  };

  const handleDrawWinner = (raffleId: string) => {
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
              <Link key={raffle.id} to={"raffle/" + raffle._id}>
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
