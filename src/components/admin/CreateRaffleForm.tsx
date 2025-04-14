import React, { useEffect, useState } from 'react';
import type { Raffle } from '../../types';
import { saveRaffle, updateRaffle } from '@/services/raffle.service';
import { useRaffleStore } from '@/store/raffleStore';
import { raffleSchema } from '@/schemas/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

type CreateRaffleFormProps = {
  onSave: () => void
  selectedRaffle: Raffle | undefined
}

type FormData = z.infer<typeof raffleSchema>;

export function CreateRaffleForm({ onSave, selectedRaffle }: CreateRaffleFormProps) {
  const { raffles, setRaffles } = useRaffleStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(raffleSchema),
    defaultValues: {
      name: '',
      description: '',
      minNumber: 0,
      maxNumber: 100,
      prize: '',
      ticketPrice: 0,
      coverUrl: '',
    }
  });

  useEffect(() => {
    if (!selectedRaffle) return;
    reset({
      name: selectedRaffle.title,
      description: selectedRaffle.description,
      minNumber: selectedRaffle.minNumber,
      maxNumber: selectedRaffle.maxNumber,
      prize: selectedRaffle.prize,
      ticketPrice: selectedRaffle.ticketPrice,
      coverUrl: selectedRaffle.coverUrl || '',
    })
  }, [reset, selectedRaffle])

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const newRaffle = {
        title: data.name,
        description: data.description,
        minNumber: data.minNumber,
        maxNumber: data.maxNumber,
        prize: data.prize,
        ticketPrice: data.ticketPrice,
        coverUrl: data.coverUrl,
        id: crypto.randomUUID(),
        status: "active",
      };

      if (selectedRaffle) {
        await updateRaffle(selectedRaffle._id, newRaffle as Raffle);
      } else {
        const savedRaffle = await saveRaffle(newRaffle as Raffle);
        setRaffles([...raffles, savedRaffle]);
      }

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

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="coverUrl" className="block text-sm font-medium text-gray-700">
              URL de la imagen de portada
            </label>
            <input
              type="url"
              id="coverUrl"
              {...register('coverUrl')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <p className="mt-1 text-xs text-gray-500">Formatos aceptados: PNG, JPG, JPEG, WEBP</p>
            {errors.coverUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.coverUrl.message}</p>
            )}
          </div>
          <div className="flex items-center justify-center">
            {watch('coverUrl') && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={watch('coverUrl')}
                  alt="Vista previa de la portada"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/600x400?text=Error+al+cargar+imagen';
                  }}
                />
              </div>
            )}
            {!watch('coverUrl') && (
              <div className="w-full aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">Vista previa de la imagen</span>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {selectedRaffle ? (isLoading ? 'EDITANDO...' : 'EDITAR RIFA') : (isLoading ? 'CREANDO...' : 'CREAR RIFA')}
        </button>
      </form>
    </div>
  );
}