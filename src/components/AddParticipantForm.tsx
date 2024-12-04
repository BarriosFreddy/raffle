import { useState } from "react";
import { AlertCircle, Gift } from "lucide-react";
import type { Raffle } from "../types";
import { ParticipantDetailsForm } from "./ParticipantDetailsForm";
import { formatMoney } from "@/utils/formatNumber";

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

export function AddParticipantForm({
  raffle,
}: AddParticipantFormProps) {
  const [selectedPackage, setSelectedPackage] = useState<number>(0);
  const [showDetails, setShowDetails] = useState(false);
  const { maxNumber, selectedNumbersQuantity  } = raffle
  const soldTicketsPercentage = Math.floor(selectedNumbersQuantity * 100 / maxNumber)
  
  const leftNumbers = maxNumber - selectedNumbersQuantity 
  const prizeImage =
    PRIZE_IMAGES[raffle.prize.toUpperCase()] ||
    "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80";
  const formattedTicketPrice = formatMoney(raffle.ticketPrice);


  if (showDetails) {
    return (
      <ParticipantDetailsForm
        raffleId={raffle._id}
        quantity={selectedPackage}
        ticketPrice={raffle.ticketPrice}
        onBack={() => setShowDetails(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative rounded-xl overflow-hidden bg-white shadow-lg">
        <img
          src={prizeImage}
          alt={raffle.prize}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 w-full">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="h-6 w-6 text-white" />
              <h3 className="text-2xl font-bold text-white">{raffle.prize}</h3>
            </div>
            <p className="text-lg font-semibold text-white">
              Valor del número: {formattedTicketPrice}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
        <div
          className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
          style={{width: `${soldTicketsPercentage}%`}}
        >
          {soldTicketsPercentage}%
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {TICKET_PACKAGES.filter(({ amount }) => amount <= leftNumbers).map(({ amount, label }) => {
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
        })}
      </div>

      {selectedPackage === 0 && (
        <div className="flex items-center space-x-3 text-amber-600 bg-amber-50 p-4 rounded-lg">
          <AlertCircle className="h-6 w-6 flex-shrink-0" />
          <span className="text-base">
            Please select a ticket package to continue
          </span>
        </div>
      )}

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
