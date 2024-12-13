import React, { useState } from "react";
import { Search, Ticket } from "lucide-react";
import type { Participant, Raffle } from "../types";
import { formatMoney } from "../utils/formatNumber";
import { assignTicketNumbers, findAll } from "@/services/payments.service";
import { TicketContainer } from "../components/TicketContainer";
import PaymentStatus from "@/enums/PaymentStatus.enum";

interface PurchaseSearchProps {
  raffles: Raffle[];
}

const APPROVED = 'approved'

export function PurchaseSearch({ raffles }: PurchaseSearchProps) {
  const [email, setEmail] = useState("");
  const [fetching, setFetching] = useState(false);
  const [send, setSend] = useState(false);

  const [searchResults, setSearchResults] = useState<
    {
      raffle: Raffle;
      participant: Participant;
    }[]
  >([]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setFetching(true);
    const payments = await findAll({email, status: PaymentStatus.APPROVED});
    setSearchResults(payments);
    setFetching(false);
    setSend(true);
  };

  const handleShowNumbers = async (preferenceId: string) => {
    if (preferenceId) {
      await assignTicketNumbers(preferenceId);
      await handleSearch()
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Encontrar mis números
      </h2>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa el correo electrónico registrado"
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          BUSCAR
        </button>
      </form>

      <div className="mt-8">
        <div className="space-y-6">
          {searchResults.map(
            ({ payer, ticketNumbers, status, amount, quantity, preferenceId }, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900">
                  Correo electrónico:{" "}
                  <span className="font-semibold">{payer.email}</span>
                </p>
                <p className="text-gray-900">Nombre: {payer.name}</p>
                <p className="text-gray-900">
                  Usuario de instagram: {payer.instagram}
                </p>
                <p className="text-gray-900">Total: {formatMoney(amount)}</p>
                <p className="text-gray-900">
                  {quantity} Números
                </p>
                <div className="space-y-2 mt-2">
                  {ticketNumbers.length === 0 && status === APPROVED && (
                    <button
                      onClick={() => handleShowNumbers(preferenceId)}
                      className="inline-flex items-center justify-center w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
                    >
                      <Ticket className="h-5 w-5 mr-2" />
                      Quiero ver mis números
                    </button>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {ticketNumbers
                      .sort((a, b) => a - b)
                      .map((number) => (
                        <TicketContainer key={number} ticketNumber={number} />
                      ))}
                  </div>
                </div>
              </div>
            )
          )}
          {send && searchResults.length === 0 && (
            <p className="text-gray-600 mt-8">
              No se registran compras con el correo electrónico: {email}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
