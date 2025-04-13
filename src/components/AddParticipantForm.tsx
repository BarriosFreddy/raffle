import { useState } from "react";
import type { Raffle } from "../types";
import { ParticipantDetailsForm } from "./ParticipantDetailsForm";
import { formatMoney } from "@/utils/formatNumber";
import RaffleCover from "@/assets/images/raffle1.webp";

interface AddParticipantFormProps {
  raffle: Raffle;
}

const TICKET_PACKAGES = [
  { amount: 1, label: "X1" },
  { amount: 2, label: "X2" },
  { amount: 4, label: "X4" },
  { amount: 6, label: "X6" },
  { amount: 8, label: "X8" },
  { amount: 10, label: "X10" },
];

// Mapping of prize keywords to relevant Unsplash images
const PRIZE_IMAGES: Record<string, string> = {
  IPHONE:
    "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
  MACBOOK:
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
  PLAYSTATION:
    "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80",
  XBOX: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=800&q=80",
  TV: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80",
};

export function AddParticipantForm({ raffle }: AddParticipantFormProps) {
  const [selectedPackage, setSelectedPackage] = useState<number>(1);
  const [showDetails, setShowDetails] = useState(false);
  const { maxNumber, selectedNumbersQuantity } = raffle;
  const soldTicketsPercentage = Math.floor(
    (selectedNumbersQuantity * 100) / maxNumber
  );

  const leftNumbers = maxNumber - selectedNumbersQuantity;

  const handlePrevPage = async () => {
    const prev = selectedPackage === 1 ? 1 : selectedPackage - 1;
    setSelectedPackage(prev);
  };

  const handleNextPage = async () => {
    const next = selectedPackage + 1;
    setSelectedPackage(next);
  };

  const handleChangeQuantity = ({ target: { value } }) => {
    setSelectedPackage(+value <= 0 ? 1 : +value);
  };

  if (showDetails) {
    return (
      <ParticipantDetailsForm
        raffle={raffle}
        quantity={selectedPackage}
        onBack={() => setShowDetails(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative rounded-xl overflow-hidden bg-white shadow-lg">
        <img
          src={raffle.coverUrl || RaffleCover}
          alt={raffle.prize}
          className="w-full h-128 object-cover"
        />
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 w-full">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="h-6 w-6 text-white" />
              <h3 className="text-2xl font-bold text-white">{raffle.prize}</h3>
            </div>
            <p className="text-lg font-semibold text-white">
              Valor del número: {formattedTicketPrice}
            </p>
          </div>
        </div> */}
      </div>
      <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
        <div
          className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
          style={{ width: `${soldTicketsPercentage}%` }}
        >
          {soldTicketsPercentage}%
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {TICKET_PACKAGES.filter(({ amount }) => amount <= leftNumbers).map(
          ({ amount, label }) => {
            const packagePrice = amount * raffle.ticketPrice;
            const formattedPackagePrice = formatMoney(packagePrice);

            return (
              <button
                key={amount}
                onClick={() => setSelectedPackage(amount)}
                className={`flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border-2 ${
                  selectedPackage === amount
                    ? "border-red-500"
                    : "border-transparent hover:border-red-500"
                }`}
              >
                <span className="text-2xl font-bold text-red-600 mb-2">
                  {label}
                </span>
                <span className="text-sm text-gray-600 text-center mb-1">
                  Compra {amount} números
                </span>
                <span className="text-lg font-semibold text-red-600">
                  {formattedPackagePrice}
                </span>
              </button>
            );
          }
        )}
      </div>

      <div className="flex items-center gap-8">
        <button
          onClick={handlePrevPage}
          disabled={selectedPackage === 1}
          className="rounded-md border border-slate-300 p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div className="mb-3">
          <input
            style={{ width: 100 }}
            value={selectedPackage}
            onChange={handleChangeQuantity}
            type="number"
            className={`block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
        </div>
        <p className="text-slate-600">
          Número{selectedPackage === 1 ? "" : "s"} seleccionados
        </p>
        <button
          onClick={handleNextPage}
          className="rounded-md border border-slate-300 p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <button
        type="button"
        disabled={selectedPackage === 0}
        onClick={() => setShowDetails(true)}
        className="w-full bg-red-600 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-red-700 active:bg-red-800 transition-colors disabled:bg-gray-400"
      >
        Continuar con {selectedPackage} números
      </button>
    </div>
  );
}
