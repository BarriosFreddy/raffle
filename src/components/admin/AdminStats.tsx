import React from "react";
import { DollarSign, Users, Ticket, Trophy } from "lucide-react";
import type { Raffle } from "../../types";
import { RaffleProgress } from "./RaffleProgress";
import { Link } from "react-router-dom";

interface AdminStatsProps {
  raffle: Raffle | undefined;
}

export function AdminStats({ raffle }: AdminStatsProps) {
  const totalTicketsSold = raffle?.selectedNumbersQuantity || 0;

  const totalRevenue =
    (raffle?.selectedNumbersQuantity || 0) * (raffle?.ticketPrice || 0);

  const stats = [
    {
      label: "Total Revenue",
      value: new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(totalRevenue),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Tickets Sold",
      value: totalTicketsSold,
      icon: Ticket,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (<>
    <div className="flex">
      <span className="mr-4">
        Enlace público:
      </span>
      <Link to={"/raffle/" + raffle?._id} target="_blank">
        <span className="text-blue-500">
          {"/raffle/" + raffle?._id}
        </span>
      </Link>
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
