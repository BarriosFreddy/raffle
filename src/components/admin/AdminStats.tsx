import React from "react";
import { DollarSign, Users, Ticket, Trophy } from "lucide-react";
import type { Raffle } from "../../types";

interface AdminStatsProps {}

export function AdminStats({}: AdminStatsProps) {
  const raffles: Raffle[] = [];

  const totalParticipants = raffles.reduce(
    (acc, raffle) => acc + raffle.participants.length,
    0
  );

  const totalTicketsSold = raffles.reduce(
    (acc, raffle) => acc + raffle.selectedNumbers.length,
    0
  );

  const totalRevenue = raffles.reduce(
    (acc, raffle) => acc + raffle.selectedNumbers.length * raffle.ticketPrice,
    0
  );

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
      label: "Total Participants",
      value: totalParticipants,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Tickets Sold",
      value: totalTicketsSold,
      icon: Ticket,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </div>
  );
}
