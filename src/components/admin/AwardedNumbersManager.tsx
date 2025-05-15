import { useState, useEffect, useMemo } from "react";
import { updateAwardedNumbers, updateBlockedNumbers } from "@/services/raffle.service";
import type { Raffle } from "@/types";
import { Save, X, Lock, Unlock } from "lucide-react";

interface AwardedNumbersManagerProps {
  raffle?: Raffle;
}

export function AwardedNumbersManager({ raffle }: AwardedNumbersManagerProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [blockedNumbers, setBlockedNumbers] = useState<number[]>([]);

  const [number, setNumber] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Store original awarded and blocked numbers for comparison
  const originalNumbers = useMemo(
    () =>
      raffle?.awardedNumbers
        ? [...raffle.awardedNumbers].sort((a, b) => a - b)
        : [],
    [raffle?.awardedNumbers]
  );

  const originalBlockedNumbers = useMemo(
    () =>
      raffle?.blockedNumbers
        ? [...raffle.blockedNumbers].sort((a, b) => a - b)
        : [],
    [raffle?.blockedNumbers]
  );

  // Initialize with existing awarded and blocked numbers
  useEffect(() => {
    if (raffle?.awardedNumbers) {
      setSelectedNumbers([...raffle.awardedNumbers]);
    }
    
    if (raffle?.blockedNumbers) {
      setBlockedNumbers([...raffle.blockedNumbers]);
    }
  }, [raffle?.awardedNumbers, raffle?.blockedNumbers]);

  // Check if there are any changes to the awarded or blocked numbers
  const hasChanges = useMemo(() => {
    const sortedSelected = [...selectedNumbers].sort((a, b) => a - b);
    const sortedBlocked = [...blockedNumbers].sort((a, b) => a - b);

    // Check if awarded numbers changed
    if (sortedSelected.length !== originalNumbers.length) {
      return true;
    }
    
    // Check if blocked numbers changed
    if (sortedBlocked.length !== originalBlockedNumbers.length) {
      return true;
    }

    // Check if any awarded number changed
    const awardedChanged = sortedSelected.some((num, index) => num !== originalNumbers[index]);
    
    // Check if any blocked number changed
    const blockedChanged = sortedBlocked.some((num, index) => num !== originalBlockedNumbers[index]);
    
    return awardedChanged || blockedChanged;
  }, [selectedNumbers, originalNumbers, blockedNumbers, originalBlockedNumbers]);

  const handleAddNumber = () => {
    const parsedNumber = parseInt(number.trim());
    if (isNaN(parsedNumber)) {
      setError("Por favor ingrese un número válido");
      return;
    }

    // Validate number is within raffle range
    if (!raffle || parsedNumber < (raffle.minNumber || 0) || parsedNumber > (raffle.maxNumber || 999999)) {
      setError(
        `El número debe estar entre ${raffle?.minNumber || 0} y ${raffle?.maxNumber || 999999}`
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
    // Also remove from blocked numbers if it was blocked
    setBlockedNumbers(blockedNumbers.filter((num) => num !== numToRemove));
  };
  
  const toggleBlockNumber = (numToToggle: number) => {
    if (blockedNumbers.includes(numToToggle)) {
      // Unblock the number
      setBlockedNumbers(blockedNumbers.filter((num) => num !== numToToggle));
    } else {
      // Block the number
      setBlockedNumbers([...blockedNumbers, numToToggle]);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Sort numbers for better display
      const sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);
      const sortedBlockedNumbers = [...blockedNumbers].sort((a, b) => a - b);
      
      // Make sure all blocked numbers are in the awarded numbers list
      const validBlockedNumbers = sortedBlockedNumbers.filter(num => 
        sortedNumbers.includes(num)
      );
      
      // First update the awarded numbers
      await updateAwardedNumbers(raffle?._id || '', sortedNumbers);
      
      // Then update the blocked numbers
      await updateBlockedNumbers(raffle?._id || '', validBlockedNumbers);
    } catch (err) {
      console.error("Error updating awarded or blocked numbers:", err);
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
      
      <div className="mb-4 text-sm">
        <p className="font-medium mb-2">Instrucciones:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Agregue números premiados usando el campo de abajo.</li>
          <li>Active la casilla de verificación para bloquear un número premiado.</li>
          <li>Los números bloqueados (<span className="text-red-500">en rojo</span>) no serán asignados en nuevas participaciones.</li>
          <li>Los números premiados desbloqueados se asignarán primero en nuevas participaciones.</li>
        </ul>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Agregar Número Premiado (Entre {raffle?.minNumber} y {raffle?.maxNumber}
          )
        </label>
        <div className="flex space-x-2">
          <input
            type="number"
            min={raffle?.minNumber || 0}
            max={raffle?.maxNumber || 999999}
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2"
            placeholder="Ingresa un número"
          />
          <button
          disabled={!raffle}
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
                  className={`flex items-center ${blockedNumbers.includes(num) ? 'bg-red-100' : 'bg-gray-100'} px-3 py-1 rounded`}
                >
                  <div className="flex items-center mr-2">
                    <input
                      type="checkbox"
                      checked={blockedNumbers.includes(num)}
                      onChange={() => toggleBlockNumber(num)}
                      className="mr-2"
                    />
                    <span className="mr-2">{num}</span>
                  </div>
                  <div className="flex">
                    <button
                      onClick={() => toggleBlockNumber(num)}
                      className={`${blockedNumbers.includes(num) ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'} mr-2`}
                      type="button"
                      title={blockedNumbers.includes(num) ? 'Desbloquear número' : 'Bloquear número'}
                    >
                      {blockedNumbers.includes(num) ? <Lock size={16} /> : <Unlock size={16} />}
                    </button>
                    <button
                      onClick={() => handleRemoveNumber(num)}
                      className="text-red-500 hover:text-red-700"
                      type="button"
                      title="Eliminar número"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="mt-5">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !hasChanges || !raffle}
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
    </div>
  );
}
