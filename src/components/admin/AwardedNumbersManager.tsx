import React, { useState, useEffect, useMemo } from "react";
import {
  updateAwardedNumbers,
  getAwardedNumbersWinners,
} from "@/services/raffle.service";
import type { Raffle } from "@/types";
import { Save, X } from "lucide-react";

interface AwardedNumbersManagerProps {
  raffle: Raffle;
  onUpdate: (updatedRaffle: Raffle) => void;
}

export function AwardedNumbersManager({
  raffle,
  onUpdate,
}: AwardedNumbersManagerProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [awardedPayments, setAwardedNumbers] = useState([]);

  const [number, setNumber] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Store original awarded numbers for comparison
  const originalNumbers = useMemo(
    () =>
      raffle.awardedNumbers
        ? [...raffle.awardedNumbers].sort((a, b) => a - b)
        : [],
    [raffle.awardedNumbers]
  );

  // Initialize with existing awarded numbers
  useEffect(() => {
    if (raffle.awardedNumbers) {
      setSelectedNumbers([...raffle.awardedNumbers]);
    }
  }, [raffle.awardedNumbers]);

  useEffect(() => {
    const fetchWinners = async () => {
      const awardedNUmbersWinners = await getAwardedNumbersWinners(raffle._id);
      setAwardedNumbers(awardedNUmbersWinners);
    };
    fetchWinners()
    const intervalId = setInterval(fetchWinners, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, [raffle._id]);

  // Check if there are any changes to the awarded numbers
  const hasChanges = useMemo(() => {
    const sortedSelected = [...selectedNumbers].sort((a, b) => a - b);

    if (sortedSelected.length !== originalNumbers.length) {
      return true;
    }

    return sortedSelected.some((num, index) => num !== originalNumbers[index]);
  }, [selectedNumbers, originalNumbers]);

  const handleAddNumber = () => {
    const parsedNumber = parseInt(number.trim());
    if (isNaN(parsedNumber)) {
      setError("Por favor ingrese un número válido");
      return;
    }

    // Validate number is within raffle range
    if (parsedNumber < raffle.minNumber || parsedNumber > raffle.maxNumber) {
      setError(
        `El número debe estar entre ${raffle.minNumber} y ${raffle.maxNumber}`
      );
      return;
    }

    // Check if number is already selected
    if (selectedNumbers.includes(parsedNumber)) {
      setError("Este número ya ha sido agregado");
      return;
    }

    setSelectedNumbers([...selectedNumbers, parsedNumber]);
    setNumber("");
    setError(null);
  };

  const handleRemoveNumber = (numToRemove: number) => {
    setSelectedNumbers(selectedNumbers.filter((num) => num !== numToRemove));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Sort numbers for better display
      const sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);

      const updatedRaffle = await updateAwardedNumbers(
        raffle._id,
        sortedNumbers
      );
      onUpdate(updatedRaffle);
    } catch (err) {
      console.error("Error updating awarded numbers:", err);
      setError("Error al guardar los números premiados");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">
        Configurar Números Premiados
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Agregar Número Premiado (Entre {raffle.minNumber} y {raffle.maxNumber}
          )
        </label>
        <div className="flex space-x-2">
          <input
            type="number"
            min={raffle.minNumber}
            max={raffle.maxNumber}
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2"
            placeholder="Ingresa un número"
          />
          <button
            onClick={handleAddNumber}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            type="button"
          >
            Agregar
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      {selectedNumbers.length > 0 && (
        <div className="mb-4">
          <h4 className="text-md font-medium mb-2">Números seleccionados:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedNumbers
              .sort((a, b) => a - b)
              .map((num) => (
                <div
                  key={num}
                  className="flex items-center bg-gray-100 px-3 py-1 rounded"
                >
                  <span className="mr-2">{num}</span>
                  <button
                    onClick={() => handleRemoveNumber(num)}
                    className="text-red-500 hover:text-red-700"
                    type="button"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="mt-5">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !hasChanges}
          className="flex items-center justify-center w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300 transition-colors"
          type="button"
          title={!hasChanges ? "No hay cambios que guardar" : ""}
        >
          {isSubmitting ? (
            "Guardando..."
          ) : (
            <>
              <Save size={18} className="mr-2" />
              Guardar Números Premiados
            </>
          )}
        </button>
      </div>
      {awardedPayments?.length > 0 && (
        <div className="mt-4">
          <h4 className="text-md font-medium mb-2">Números premiados:</h4>
          <div className="flex flex-wrap gap-2">
            {awardedPayments?.map(({ payer, ticketNumbers }, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 p-2 rounded"
              >
                {ticketNumbers?.map((number) => (
                  <div
                    key={number}
                    className="flex items-center bg-yellow-100 m-1 px-1 py-1 rounded border-gray-300 border"
                  >
                    <span className="m-1">{number}</span>
                  </div>
                ))}
                <span className="mr-2">{payer.email}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
