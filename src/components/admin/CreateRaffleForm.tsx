import React, { useState } from 'react';
import type { Raffle } from '../../types';
import { saveRaffle } from '@/services/raffle.service';
import { useRaffleStore } from '@/store/raffleStore';

type CreateRaffleFormProps = {
  onSave: () => void
} 
 
export function CreateRaffleForm({ onSave }: CreateRaffleFormProps) {
  const { raffles, setRaffles } = useRaffleStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prize: '',
    minNumber: 1,
    maxNumber: 100
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRaffle = async () => {
    try {
      setIsLoading(true);
      const newRaffle: Raffle = {
        ...formData,
        ticketPrice: 3000,
        id: crypto.randomUUID(),
        status: "active",
        selectedNumbers: [],
      };
      
      const savedRaffle = await saveRaffle(newRaffle);
      setRaffles([...raffles, savedRaffle]);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        prize: '',
        minNumber: 1,
        maxNumber: 100
      });
      if(onSave) onSave()
    } catch (error) {
      console.error('Error creating raffle:', error);
      // Here you could add a toast notification for error handling
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Crear Nueva Rifa</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título de la Rifa
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="mt-1 block w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="mt-1 block w-full"
            rows={3}
            required
          />
        </div>

        <div>
          <label htmlFor="prize" className="block text-sm font-medium text-gray-700">
            Premio
          </label>
          <input
            type="text"
            id="prize"
            value={formData.prize}
            onChange={(e) => setFormData(prev => ({ ...prev, prize: e.target.value }))}
            className="mt-1 block w-full"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="minNumber" className="block text-sm font-medium text-gray-700">
              Número Mínimo
            </label>
            <input
              type="number"
              id="minNumber"
              value={formData.minNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, minNumber: parseInt(e.target.value) }))}
              className="mt-1 block w-full"
              min="1"
              required
            />
          </div>

          <div>
            <label htmlFor="maxNumber" className="block text-sm font-medium text-gray-700">
              Número Máximo
            </label>
            <input
              type="number"
              id="maxNumber"
              value={formData.maxNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, maxNumber: parseInt(e.target.value) }))}
              className="mt-1 block w-full"
              min={formData.minNumber + 1}
              required
            />
          </div>
        </div>

        <button
          onClick={handleCreateRaffle}
          type="button"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {isLoading ? 'CREANDO...' : 'CREAR RIFA'}
        </button>
      </div>
    </div>
  );
}