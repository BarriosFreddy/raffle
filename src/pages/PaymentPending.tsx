import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Home } from 'lucide-react';

export function PaymentPending() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <Clock className="h-16 w-16 text-yellow-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Pending
        </h1>
        <p className="text-gray-600 mb-8">
          Your payment is being processed. This may take a few moments.
          Once confirmed, your raffle tickets will be assigned automatically.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          <Home className="h-5 w-5 mr-2" />
          Return to Home
        </Link>
      </div>
    </div>
  );
}