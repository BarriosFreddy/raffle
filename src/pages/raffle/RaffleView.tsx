import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRaffleStore } from "../../store/raffleStore";
import { getRaffleById, getRaffleBySlug } from "@/services/raffle.service";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PackageSelectorForm } from './components/PackageSelectorForm';

export function RaffleView() {
  const { raffleId } = useParams<{ raffleId: string }>();
  const { raffle, setRaffle } = useRaffleStore();

  useEffect(() => {
    (async () => {
      if (raffleId) {
        try {
          // First try to get raffle by slug
          const raffleData = await getRaffleBySlug(raffleId);
          setRaffle(raffleData);
        } catch (slugError) {
          try {
            // Fallback to get by ID for backward compatibility
            const raffleData = await getRaffleById(raffleId);
            setRaffle(raffleData);
          } catch (idError) {
            console.error("Failed to fetch raffle by ID:", idError);
            console.error("Original slug error:", slugError);
          }
        }
      }
    })();
  }, [raffleId]);

  if (raffle?.status !== "active") {
    return (
      <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Raffle</h2>
        <p className="text-gray-600">Cargando....</p>
      </div>
    );
  }

  return (
    <>
      <Header themeColor={raffle.themeColor} />
      <div className="max-w-7xl mx-auto">
        <div className="m-8">
          <PackageSelectorForm raffle={raffle} />
        </div>
      </div>
      <Footer />
    </>
  );
}
