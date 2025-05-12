import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRaffleStore } from "../../store/raffleStore";
import { getRaffleById, getRaffleBySlug, getLiveRaffleById, getLiveRaffleBySlug } from "@/services/raffle.service";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PackageSelectorForm } from './components/PackageSelectorForm';

export function RaffleView() {
  const { raffleId } = useParams<{ raffleId: string }>();
  const { raffle, setRaffle } = useRaffleStore();

  // Initial fetch of raffle data
  useEffect(() => {
    const fetchRaffleData = async () => {
      if (!raffleId) return;
      
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
    };

    fetchRaffleData();
  }, [raffleId, setRaffle]);
  
  // Poll for updates every 10 seconds
  useEffect(() => {
    // Don't start polling until we have the initial raffle data
    if (!raffle || !raffleId) return;
    
    const updateRaffleData = async () => {
      try {
        // Use the appropriate live data method based on what we initially used
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(raffleId);
        
        // Use the live data endpoints that bypass cache
        const updatedRaffle = isUuid
          ? await getLiveRaffleById(raffleId)
          : await getLiveRaffleBySlug(raffleId);
          
        // Always update since we're getting fresh data that bypasses cache
        setRaffle(updatedRaffle);
      } catch (error) {
        console.error("Error polling for live raffle updates:", error);
      }
    };

    const intervalId = setInterval(updateRaffleData, 8000); // Poll every 8 seconds
    
    return () => clearInterval(intervalId); // Clean up on unmount
  }, [raffle, raffleId, setRaffle]);

  if (!raffle) {
    return (
      <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg m-7">
        <h2 className="text-xl font-bold mb-4">Cargando...</h2>
      </div>
    );
  }

  if (raffle?.status !== "active") {
    return (
      <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg m-7">
        <h2 className="text-xl font-bold mb-4">Evento Finalizado!</h2>
        <p className="text-gray-600">Gracias por tu compra, puedes consultar tus números en la sección de Mis Compras</p>
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
      <Footer supportPhoneNumber={raffle.supportPhoneNumber} />
    </>
  );
}
