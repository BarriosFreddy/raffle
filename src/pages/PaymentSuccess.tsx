import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();

  const queryParams = Object.fromEntries(  
    new URLSearchParams(searchParams)
  )
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your raffle tickets have been successfully assigned.
          You can check your tickets in the "Search My Tickets" section.
          {
            JSON.stringify(queryParams, null, 2)
          }
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