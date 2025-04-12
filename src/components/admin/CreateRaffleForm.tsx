import React, { useState } from 'react';
import type { Raffle } from '../../types';
import { saveRaffle } from '@/services/raffle.service';
import { useRaffleStore } from '@/store/raffleStore';
import { raffleSchema } from '@/schemas/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

type CreateRaffleFormProps = {
  onSave: () => void
}

type FormData = z.infer<typeof raffleSchema>;

export function CreateRaffleForm({ onSave }: CreateRaffleFormProps) {
  const { raffles, setRaffles } = useRaffleStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(raffleSchema),
    defaultValues: {
      name: '',
      description: '',
      minNumber: 1,
      maxNumber: 100,
      prize: '',
      ticketPrice: 3000,
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const newRaffle: Raffle = {
        title: data.name,
        description: data.description,
        minNumber: data.minNumber,
        maxNumber: data.maxNumber,
        prize: data.prize,
        ticketPrice: data.ticketPrice,
        id: crypto.randomUUID(),
        status: "active",
        selectedNumbers: [],
      };

      const savedRaffle = await saveRaffle(newRaffle);
      setRaffles([...raffles, savedRaffle]);

      // Reset form
      reset();
      if (onSave) onSave();
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Título de la Rifa
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="description"
            {...register('description')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="prize" className="block text-sm font-medium text-gray-700">
            Premio
          </label>
          <textarea
            id="prize"
            {...register('prize')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={2}
          />
          {errors.prize && (
            <p className="mt-1 text-sm text-red-600">{errors.prize.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="minNumber" className="block text-sm font-medium text-gray-700">
              Número Mínimo
            </label>
            <input
              type="number"
              id="minNumber"
              {...register('minNumber', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.minNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.minNumber.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="maxNumber" className="block text-sm font-medium text-gray-700">
              Número Máximo
            </label>
            <input
              type="number"
              id="maxNumber"
              {...register('maxNumber', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.maxNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.maxNumber.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-700">
            Precio del Ticket
          </label>
          <input
            type="number"
            id="ticketPrice"
            {...register('ticketPrice', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.ticketPrice && (
            <p className="mt-1 text-sm text-red-600">{errors.ticketPrice.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {isLoading ? 'CREANDO...' : 'CREAR RIFA'}
        </button>
      </form>
    </div>
  );
}