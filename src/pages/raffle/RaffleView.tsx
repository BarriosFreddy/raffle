import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRaffleStore } from "../../store/raffleStore";
import { AddParticipantForm } from "./components/AddParticipantForm";
import { getRaffleById } from "@/services/raffle.service";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function RaffleView() {
  const { raffleId } = useParams<{ raffleId: string }>();
  const { raffle, setRaffle } = useRaffleStore();

  useEffect(() => {
    (async () => {
      if (raffleId) {
        const raffleData = await getRaffleById(raffleId);
        setRaffle(raffleData);
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
      <div className="max-w-lg mx-auto">
        <div className="mt-8 mb-8">
          <AddParticipantForm raffle={raffle} />
        </div>
      </div>
      <Footer />
    </>
  );
}
