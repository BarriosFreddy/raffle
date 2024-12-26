import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Home, Ticket } from "lucide-react";
import {
  processPaymentResponse,
  assignTicketNumbers,
  processPaymentEPayco,
} from "@/services/payments.service";
import { TicketContainer } from "@/components/TicketContainer";
import PaymentStatus from "@/enums/PaymentStatus.enum";

export function PaymentResponse() {
  const [paymentData, setPaymentData] = useState(null);
  const [searchParams] = useSearchParams();

  const paymentResponse = Object.fromEntries(new URLSearchParams(searchParams));
  const refPayco = paymentResponse.ref_payco;

  useEffect(() => {
    (async () => {
      const paymentEpaycoResponse = await processPaymentEPayco(refPayco);
      const { data } = paymentEpaycoResponse;
      const paymentDataRes = await processPaymentResponse(data);
      setPaymentData(paymentDataRes);
    })();
  }, []);

  const ticketNumbers: Array<number> = paymentData
    ? paymentData.ticketNumbers
    : [];

  const handleShowNumbers = async () => {
    console.log({ paymentData });
    if (paymentData) {
      const paymentDataResponse = await assignTicketNumbers({
        email: paymentData.payer.email,
      });
      setPaymentData(paymentDataResponse);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {paymentData?.status === PaymentStatus.APPROVED
            ? "Pago Exitoso!"
            : "Su pago no fué exitoso o valide más tarde"}
        </h1>
        <p className="text-gray-600 mb-8">
          {paymentData?.status === PaymentStatus.APPROVED
            ? `Gracias por tu compra.
          Por favor, Cliquea el botón que está abajo para ver tus números.
          También puedes consultar tus números en la sección de Mis Compras`
            : `Lo sentimos, pero su pago no pudo ser procesado. 
          Por favor, intenta nuevamente o contacta a soporte si persiste el inconveniente.`}
        </p>

        {ticketNumbers.length === 0 && (
          <button
            onClick={handleShowNumbers}
            className="inline-flex items-center justify-center w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
          >
            <Ticket className="h-5 w-5 mr-2" />
            Quiero ver mis números
          </button>
        )}
        <section className="grid grid-cols-2 gap-4">
          {ticketNumbers.map((number) => (
            <TicketContainer key={number} ticketNumber={number} />
          ))}
        </section>

        <Link
          to="/"
          className="mt-3 inline-flex items-center justify-center w-full py-3 px-4 rounded-lg text-base font-medium hover:bg-blue-700 hover:text-white active:bg-blue-800 transition-colors"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
