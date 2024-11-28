import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { XCircle, Home } from 'lucide-react';
import { processPaymentResponse } from '@/services/payments.service';

export function PaymentFailure() {
  const [searchParams] = useSearchParams();

  const paymentResponse = Object.fromEntries(new URLSearchParams(searchParams));

  console.log(JSON.stringify(paymentResponse, null, 2));

  useEffect(() => {
    (async () => {
      if (paymentResponse) {
        await processPaymentResponse(paymentResponse);
      }
    })();
  }, [paymentResponse]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <XCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Failed
          Su pago no fué exitoso!
        </h1>
        <p className="text-gray-600 mb-8">
          Lo sentimos, pero su pago no pudo ser procesado. Por favor, intenta nuevamente o contacta a soporte si persiste el inconveniente.
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