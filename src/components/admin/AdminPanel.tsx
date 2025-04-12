import React, { useEffect, useState } from "react";
import { PurchasesList } from "./PurchasesList";
import { AdminStats } from "./AdminStats";
import { findAll } from "@/services/payments.service";
import { getRaffles } from "@/services/raffle.service";
import { AdminLogin } from "../AdminLogin";
import { Link } from "react-router-dom";
import { ArrowLeft, LogOut, Plus, Search } from "lucide-react";
import { useRaffleStore } from "@/store/raffleStore";
import { RaffleCard } from "../RaffleCard";
import { Raffle } from "@/types";

const APPROVED = "approved";

export function AdminPanel() {
  const { raffles, setRaffles } = useRaffleStore();
  const [page, setPage] = useState(1);
  const [payments, setPayments] = useState([]);
  const [selectedRaffle, setSelectedRaffle] = useState<Raffle>();
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    (async () => {
      const rafflesData = await getRaffles()
      setRaffles(rafflesData)
    })()
  }, [])

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

  const handleAdminLogin = (success: boolean) => {
    setShowAdminPanel(success);
  };

  const handleLogout = () => {
    setShowAdminPanel(false);
  };

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
    setSelectedRaffle(undefined)
  }

  if (!showAdminPanel)
    return <AdminLogin onLogin={handleAdminLogin} />

  if (showAdminPanel)
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <Link
            to="/create"
            className="inline-flex items-center py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors"
          >
            <Plus className="h-5 w-5 mr-1" />
            CREAR RIFA
          </Link>
          <Link
            to="/search"
            className="inline-flex items-center py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors"
          >
            <Search className="h-5 w-5 mr-1" />
            COMPRAS
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center py-2 px-4 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 active:bg-red-300 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-1" />
            CERRAR SESIÓN
          </button>
        </div>
        {selectedRaffle && <button
          onClick={handleBack}
          className="inline-flex items-center py-2 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          REGRESAR
        </button>}
        {!selectedRaffle && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {raffles.map((raffle) => (
            <div
              onClick={() => setSelectedRaffle(raffle)}
              className="cursor-pointer touch-manipulation"
            >
              <RaffleCard
                raffle={raffle}
              />
            </div>
          ))}
          {raffles.length === 0 && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">
                No hay rifas aún
              </h3>
            </div>
          )}
        </div>}

        {selectedRaffle && (<>
          <AdminStats raffle={selectedRaffle} />
          <PurchasesList payments={payments} page={page} onNext={handleNextPage} onPrev={handlePrevPage} /> </>
        )}
      </div>
    );
}
