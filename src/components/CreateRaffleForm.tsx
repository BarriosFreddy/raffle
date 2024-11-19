import React, { useState } from 'react';
import type { Raffle } from '../types';

interface CreateRaffleFormProps {
  onCreate: (raffle: Omit<Raffle, 'id' | 'participants' | 'winners' | 'status' | 'selectedNumbers'>) => void;
}

export function CreateRaffleForm({ onCreate }: CreateRaffleFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prize: '',
    minNumber: 1,
    maxNumber: 100
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
    setFormData({ title: '', description: '', prize: '', minNumber: 1, maxNumber: 100 });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Raffle Title
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
          Description
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
          Prize
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
            Minimum Number
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
            Maximum Number
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
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create Raffle
      </button>
    </form>
  );
}