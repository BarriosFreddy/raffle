import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { PaymentButton } from './PaymentButton';
import { formatTicketNumber } from '../utils/formatNumber';

interface ParticipantDetailsFormProps {
  selectedNumbers: number[];
  totalPrice: number;
  onSubmit: (name: string, email: string, phone: string) => void;
  onBack: () => void;
}

export function ParticipantDetailsForm({ 
  selectedNumbers, 
  totalPrice, 
  onSubmit, 
  onBack 
}: ParticipantDetailsFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showPayment, setShowPayment] = useState(false);

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(totalPrice);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    onSubmit(name, email, phone);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4 text-gray-800 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center text-base hover:text-blue-600"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <h2 className="text-lg font-semibold">Enter Your Details</h2>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ShoppingCart className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
          </div>
          <span className="text-lg font-bold text-blue-600">{formattedPrice}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedNumbers.sort((a, b) => a - b).map(number => (
            <span
              key={number}
              className="inline-flex items-center px-3 py-1 rounded-lg text-sm bg-blue-100 text-blue-800"
            >
              {formatTicketNumber(number, Math.max(...selectedNumbers))}
            </span>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-base font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          pattern="[0-9]*"
          inputMode="numeric"
          placeholder="Enter your phone number"
        />
      </div>

      {!showPayment ? (
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          Proceed to Payment ({formattedPrice})
        </button>
      ) : (
        <PaymentButton
          title={`Raffle Tickets (${selectedNumbers.length})`}
          price={totalPrice}
          quantity={1}
          name={name}
          email={email}
          phone={phone}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </form>
  );
}