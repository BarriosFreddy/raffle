import { useEffect, useState } from "react";
import { PurchasesList } from "./PurchasesList";
import { AdminStats } from "./AdminStats";
import { findAll } from "@/services/payments.service";
import { getRaffles, getLiveRaffleById } from "@/services/raffle.service";
import { AdminLogin } from "../AdminLogin";
import { ArrowLeft, Plus } from "lucide-react";
import { useRaffleStore } from "@/store/raffleStore";
import { RaffleCard } from "../RaffleCard";
import { Raffle } from "@/types";
import { CreateRaffleForm } from "./CreateRaffleForm";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "../Header";
import { Footer } from "../Footer";

const APPROVED = "approved";

export function AdminPanel() {
  const { isAuthenticated } = useAuth();
  const { raffles, setRaffles } = useRaffleStore();
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [payments, setPayments] = useState([]);
  const [selectedRaffle, setSelectedRaffle] = useState<Raffle>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [intervalId, setIntervalId] = useState<number>();

  // Initial fetch of raffle data
  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const rafflesData = await getRaffles();
        setRaffles(rafflesData);
      } catch (error) {
        console.error("Error fetching raffles:", error);
      }
    };
    
    fetchRaffles();
  }, [setRaffles]);
  
  // Poll for raffle updates every 15 seconds
  useEffect(() => {
    // Only start polling if user is logged in
    if (!isLoggedIn) return;
    
    const updateRaffles = async () => {
      try {
        // Get fresh list of raffles
        const rafflesData = await getRaffles();
        setRaffles(rafflesData);
        
        // If a raffle is selected, get its latest data directly from live endpoint
        if (selectedRaffle) {
          try {
            // Use the live endpoint to bypass cache
            const liveRaffleData = await getLiveRaffleById(selectedRaffle._id);
            if (liveRaffleData) {
              setSelectedRaffle(liveRaffleData);
            }
          } catch (selectedRaffleError) {
            console.error("Error fetching live data for selected raffle:", selectedRaffleError);
          }
        }
      } catch (error) {
        console.error("Error polling for raffle updates:", error);
      }
    };
    
    const intervalIdQuery = setInterval(updateRaffles, 15000); // Poll every 15 seconds
    setIntervalId(intervalIdQuery);
    
    return () => clearInterval(intervalIdQuery); // Clean up on unmount
  }, [isLoggedIn, raffles, selectedRaffle, setRaffles]);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    (async () => {
      if (!selectedRaffle) return;
      const paymentsData = await findAll({
        raffleId: selectedRaffle._id,
        status: APPROVED,
        page: 1,
      });
      setPayments(paymentsData);
    })();
  }, [selectedRaffle]);

  const handlePrevPage = async () => {
    const prev = page === 1 ? 1 : page - 1;
    setPage(prev);
    const paymentsData = await findAll({
      status: APPROVED,
      page: prev,
    });
    setPayments(paymentsData);
  };

  const handleNextPage = async () => {
    const next = page + 1;
    setPage(next);
    const paymentsData = await findAll({
      status: APPROVED,
      page: next,
    });
    setPayments(paymentsData);
  };

  const handleBack = () => {
    setSelectedRaffle(undefined);
    setShowForm(false);
  };

  const handleSave = async () => {
    handleBack();
    const paymentsData = await findAll({
      status: APPROVED,
      page: 1,
    });
    setPayments(paymentsData);
  };

  const handleLogin = (success: boolean) => {
    setIsLoggedIn(success);
  };

  const handleEditRaffle = () => {
    setShowForm(true);
    clearInterval(intervalId);
  };

  const handleSelectRaffle = async (raffle: Raffle) => {
    setSelectedRaffle(raffle);
    const liveRaffleData = await getLiveRaffleById(raffle._id);
    if (liveRaffleData) {
      setSelectedRaffle(liveRaffleData);
    }
    setShowForm(false);
  };

  const handleCreateRaffle = () => {
    setShowForm(true);
    clearInterval(intervalId);
  };

  if (!isLoggedIn) return <AdminLogin onLogin={handleLogin} />;

  if (isLoggedIn)
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="space-y-6">
              {!selectedRaffle && !showForm && (
                <div className="flex justify-between">
                  <button
                    onClick={handleCreateRaffle}
                    className="inline-flex items-center py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors"
                  >
                    <Plus className="h-5 w-5 mr-1" />
                    CREAR RIFA
                  </button>
                </div>
              )}
              {(selectedRaffle || showForm) && (
                <button
                  onClick={handleBack}
                  className="inline-flex items-center py-2 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 mr-1" />
                  REGRESAR
                </button>
              )}
              {showForm && (
                <CreateRaffleForm
                  onSave={handleSave}
                  selectedRaffle={selectedRaffle}
                />
              )}
              {!selectedRaffle && !showForm && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {raffles.map((raffle) => (
                    <div
                      key={raffle._id}
                      onClick={() => handleSelectRaffle(raffle)}
                      className="cursor-pointer touch-manipulation"
                    >
                      <RaffleCard raffle={raffle} />
                    </div>
                  ))}
                  {raffles.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <h3 className="text-lg font-medium text-gray-900">
                        No hay Eventos aún
                      </h3>
                    </div>
                  )}
                </div>
              )}

              {selectedRaffle && !showForm && (
                <>
                  <AdminStats
                    raffle={selectedRaffle}
                    onEdit={handleEditRaffle}
                  />
                  <PurchasesList
                    raffle={selectedRaffle}
                    payments={payments}
                    page={page}
                    onNext={handleNextPage}
                    onPrev={handlePrevPage}
                  />{" "}
                </>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
}
