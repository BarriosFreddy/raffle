import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, AlertCircle, Ticket, Loader } from "lucide-react";
import {
  processPaymentResponse,
  assignTicketNumbers,
  processPaymentEPayco,
  getOpenPayRecordByOrderId,
} from "@/services/payments.service";
import { TicketContainer } from "@/components/TicketContainer";
import PaymentStatus from "@/enums/PaymentStatus.enum";
import { getRaffleById } from "@/services/raffle.service";
import { Raffle } from "@/types";

export function PaymentResponse() {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [searchParams] = useSearchParams();
  const [raffle, setRaffle] = useState<Raffle>();

  const paymentResponse = Object.fromEntries(new URLSearchParams(searchParams));
  const refPayco = paymentResponse.ref_payco;
  const boldOrderId = paymentResponse["bold-order-id"];
  const boldTXStatus = paymentResponse["bold-tx-status"];

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (refPayco) {
        const paymentEpaycoResponse = await processPaymentEPayco(refPayco);
        const { data } = paymentEpaycoResponse;
        const paymentDataRes = await processPaymentResponse(data);
        setPaymentData(paymentDataRes);
        if (paymentDataRes) {
          const raffleRes = await getRaffleById(paymentDataRes.raffleId);
          setRaffle(raffleRes);
        }
      }
      setLoading(false);
    })();
  }, [refPayco]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      // BOLD gateway support
      if (boldOrderId && boldTXStatus) {
        const paymentDataRes = await processPaymentResponse({
          boldOrderId,
          boldTXStatus,
        });
        setPaymentData(paymentDataRes);
        if (paymentDataRes) {
          const raffleRes = await getRaffleById(paymentDataRes.raffleId);
          setRaffle(raffleRes);
        }
        setLoading(false);
        return;
      }
      const openPayOrderId = boldOrderId;
      //OpenPay gateway support
      if (openPayOrderId) {
        const openPayPayments = await getOpenPayRecordByOrderId(openPayOrderId);
        if (openPayPayments.errors) {
          console.error(openPayPayments);
          setLoading(false);
          return;
        }
        const openPayPayment = openPayPayments.pop();
        const paymentDataRes = await processPaymentResponse({
          ...openPayPayment,
          boldOrderId: openPayOrderId,
          boldTXStatus: openPayPayment.status,
        });
        setPaymentData(paymentDataRes);
        if (paymentDataRes) {
          const raffleRes = await getRaffleById(paymentDataRes.raffleId);
          setRaffle(raffleRes);
        }
        setLoading(false);
        return;
      }
    })();
  }, [boldOrderId, boldTXStatus]);

  const ticketNumbers: Array<number> = paymentData?.ticketNumbers || [];

  const handleShowNumbers = async () => {
    if (paymentData && paymentData._id) {
      const paymentDataResponse = await assignTicketNumbers({
        paymentId: paymentData._id,
      });
      setPaymentData(paymentDataResponse);
    }
  };

  return (
    <>
      {loading ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <Loader className="h-16 w-16 text-green-500" />
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              {paymentData?.status === PaymentStatus.APPROVED ? (
                <CheckCircle className="h-16 w-16 text-green-500" />
              ) : (
                <AlertCircle className="h-16 w-16 text-orange-500" />
              )}
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

            {paymentData?.status === PaymentStatus.APPROVED &&
              ticketNumbers.length === 0 && (
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
                <TicketContainer
                  key={number}
                  ticketNumber={number}
                  digits={raffle ? raffle.maxNumber.toString().length - 1 : 0}
                />
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
      )}
    </>
  );
}
