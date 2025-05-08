import { Gift, CreditCard } from 'lucide-react';
import type { Raffle } from '../types';

interface RaffleCardProps {
  raffle: Raffle;
}

export function RaffleCard({ raffle }: RaffleCardProps) {
  const isActive = raffle.status === 'active';
  const themeColor = raffle.themeColor || '#4f46e5'; // Default to indigo if not set
  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(raffle.ticketPrice);
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl active:shadow-md border-t-4" style={{ borderTopColor: themeColor }}>
      {raffle.coverUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={raffle.coverUrl} 
            alt={raffle.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; // Prevent infinite loops
              target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800">{raffle.title}</h3>
          <span className={`px-3 py-1 rounded-full text-sm ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {isActive ? 'Activa' : 'Completada'}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4">{raffle.description}</p>
      
        <div className="space-y-4">
          <div className="flex items-center text-gray-700">
            <Gift className="w-6 h-6 mr-3" style={{ color: themeColor }} />
            <span className="text-base">{raffle.prize}</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <CreditCard className="w-6 h-6 mr-3" style={{ color: themeColor }} />
            <span className="text-base">Valor del número: {formattedPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}