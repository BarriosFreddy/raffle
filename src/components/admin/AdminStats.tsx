import React, { useState, useEffect } from "react";
import { DollarSign, Ticket } from "lucide-react";
import type { Raffle } from "../../types";
import { RaffleProgress } from "./RaffleProgress";
import { Link } from "react-router-dom";
import { formatMoney } from '@/utils/formatNumber';
import { assignAvailableNumbers, checkAvailableNumbers } from "@/services/raffle.service";

interface AdminStatsProps {
  raffle: Raffle | undefined;
  onEdit: () => void;
}

export function AdminStats({ raffle, onEdit }: AdminStatsProps) {
  const [isAssigning, setIsAssigning] = useState(false);
  const [hasNumbers, setHasNumbers] = useState(false);
  const totalTicketsSold = raffle?.selectedNumbersQuantity || 0;

  const totalRevenue =
    (raffle?.selectedNumbersQuantity || 0) * (raffle?.ticketPrice || 0);

  const stats = [
    {
      label: "Total de Ingresos",
      value: new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(totalRevenue),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Tickets Vendidos",
      value: totalTicketsSold,
      icon: Ticket,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  useEffect(() => {
    const checkNumbers = async () => {
      if (!raffle?._id) return;
      try {
        const hasAssignedNumbers = await checkAvailableNumbers(raffle._id);
        setHasNumbers(hasAssignedNumbers);
      } catch (error) {
        console.error('Error checking available numbers:', error);
      }
    };
    checkNumbers();
  }, [raffle?._id]);

  const handleNumberAssignment = async () => {
    if (!raffle?._id) return;
    try {
      setIsAssigning(true);
      await assignAvailableNumbers(raffle._id);
      setHasNumbers(true);
    } catch (error) {
      console.error('Error assigning numbers:', error);
      alert('Error al asignar números disponibles');
    } finally {
      setIsAssigning(false);
    }
  };

  return (<>
    <div className="flex">
      <span className="mr-4">
        Enlace público:
      </span>
      <Link to={"/raffle/" + raffle?.slug} target="_blank">
        <span className="text-blue-500">
          {"/raffle/" + raffle?.slug}
        </span>
      </Link>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div>
        <p className="font-bold">Nombre</p>
        <p>{raffle?.title}</p>
      </div>
      <div>
        <p className="font-bold">Premio</p>
        <p>{raffle?.prize}</p>
      </div>
      <div>
        <p className="font-bold">Precio del ticket</p>
        <p>{raffle?.ticketPrice && formatMoney(raffle?.ticketPrice)}</p>
      </div>
      <div className="flex items-center justify-end col-span-2 gap-2">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:bg-green-300"
          onClick={handleNumberAssignment}
          disabled={isAssigning || hasNumbers}
          title={hasNumbers ? "Los números ya están asignados" : ""}
        >
          {isAssigning ? 'ASIGNANDO...' : 'ASIGNAR NÚMEROS'}
        </button>
        <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors" onClick={() => onEdit && onEdit()}>
          EDITAR
        </button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
      {stats.map(({ label, value, icon: Icon, color, bgColor }) => (
        <div key={label} className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{label}</p>
              <p className={`text-2xl font-bold ${color} mt-2`}>{value}</p>
            </div>
            <div className={`p-3 rounded-full ${bgColor}`}>
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
          </div>
        </div>
      ))}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <RaffleProgress raffle={raffle} />
      </div>
    </div>
  </>
  );
}
