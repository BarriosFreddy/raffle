import React, { useState } from "react";
import { Search, Ticket } from "lucide-react";
import type { Participant, Raffle } from "../types";
import { formatMoney } from "../utils/formatNumber";
import {
  assignTicketNumbers,
  findAll,
  getBoldRecordByOrderId,
  getMercadoPagoPaymentByOrderId,
  getOpenPayRecordByOrderId,
  processPaymentResponse,
} from "@/services/payments.service";
import { TicketContainer } from "../components/TicketContainer";
import PaymentStatus from "@/enums/PaymentStatus.enum";
import { getRaffleById } from "@/services/raffle.service";
import { PaymentDataDTO } from "@/types/paymentDataDTO";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { PaymentGateway } from "@/enums/PaymentGateway.enum";
dayjs.extend(utc);

const APPROVED = "approved";

export function PurchaseSearch() {
  const [email, setEmail] = useState("");
  const [fetching, setFetching] = useState(false);
  const [send, setSend] = useState(false);
  const [raffle, setRaffle] = useState<Raffle>();

  const [searchResults, setSearchResults] = useState<
    {
      raffle: Raffle;
      participant: Participant;
    }[]
  >([]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setFetching(true);
    let payments = await findAll({ email, status: PaymentStatus.APPROVED });
    if (payments.length) {
      const raffleRes = await getRaffleById(payments[0].raffleId);
      setRaffle(raffleRes);
    }

    try {
      const paymentsPending = await findAll({
        email,
        status: PaymentStatus.PENDING,
      });

      for await (const payment of paymentsPending) {
        const paymentRaffle = await getRaffleById(payment.raffleId);
        let paymentData: PaymentDataDTO | undefined;
        if (paymentRaffle.paymentGateway === PaymentGateway.BOLD) {
          paymentData = await validateBoldPayment(payment);
        }
        if (paymentRaffle.paymentGateway === PaymentGateway.MERCADO_PAGO) {
          paymentData = await validateMercadoPagoPayment(payment);
        }
        if (paymentRaffle.paymentGateway === PaymentGateway.OPEN_PAY) {
          paymentData = await validateOpenPayPayment(payment);
          payments = await findAll({
            email,
            status: PaymentStatus.APPROVED,
          });
        }
        if (!paymentData) continue;
        setRaffle(paymentRaffle);
      }
    } catch (e) {
      console.error(e);
    }
    setSearchResults(payments);
    setFetching(false);
    setSend(true);
  };

  const validateBoldPayment = async (payment: any) => {
    const boldRecord = await getBoldRecordByOrderId(payment.orderId);
    if (boldRecord.errors) {
      console.error(boldRecord);
      return;
    }
    const { payment_status } = boldRecord;
    if (
      payment_status &&
      payment_status.toLowerCase() === PaymentStatus.APPROVED
    ) {
      const paymentData = await processPaymentResponse({
        boldOrderId: payment.orderId,
        boldTXStatus: PaymentStatus.APPROVED,
      });
      return paymentData;
    }
  };

  const validateMercadoPagoPayment = async (payment: any) => {
    const mercadoPagoPayment = await getMercadoPagoPaymentByOrderId(
      payment.orderId
    );
    if (mercadoPagoPayment.errors) {
      console.error(mercadoPagoPayment);
      return;
    }
    if (
      mercadoPagoPayment &&
      mercadoPagoPayment.status.toLowerCase() === PaymentStatus.APPROVED
    ) {
      const paymentData = await processPaymentResponse({
        ...mercadoPagoPayment,
        payment_id: mercadoPagoPayment.id,
      });
      return paymentData;
    }
  };

  const validateOpenPayPayment = async (payment: any) => {
    const openPayPayments = await getOpenPayRecordByOrderId(payment.orderId);
    if (openPayPayments.errors) {
      console.error(openPayPayments);
      return;
    }
    const openPayPayment = openPayPayments.pop();
    const paymentData = await processPaymentResponse({
      ...openPayPayment,
      boldOrderId: payment.orderId,
      boldTXStatus: openPayPayment.status,
    });
    return paymentData;
  };

  const handleShowNumbers = async (paymentData: Partial<PaymentDataDTO>) => {
    if (paymentData && paymentData._id) {
      await assignTicketNumbers({
        paymentId: paymentData._id,
      });
      await handleSearch();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-10">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Encontrar mis números
      </h2>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa el correo electrónico registrado"
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        <button
          disabled={fetching}
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          {fetching ? "BUSCANDO..." : "BUSCAR"}
        </button>
      </form>

      <div className="mt-8">
        <div className="space-y-6">
          {searchResults.map(
            (
              { _id, payer, ticketNumbers, status, amount, quantity, raffleId },
              index
            ) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900">
                  Correo electrónico:{" "}
                  <span className="font-semibold">{payer.email}</span>
                </p>
                <p className="text-gray-900">Nombre: {payer.name}</p>
                <p className="text-gray-900">Teléfono: {payer.phone}</p>
                <p className="text-gray-900">Cédula: {payer.nationalId}</p>
                <p className="text-gray-900">
                  Fecha: {dayjs(payer.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                </p>
                <p className="text-gray-900">
                  Id del Evento: {raffleId.substring(0, 6)}
                </p>
                <p className="text-gray-900">Total: {formatMoney(amount)}</p>
                <p className="text-gray-900">{quantity} Números</p>
                <div className="space-y-2 mt-2">
                  {ticketNumbers.length === 0 && status === APPROVED && (
                    <button
                      onClick={() => handleShowNumbers({ _id })}
                      className="inline-flex items-center justify-center w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
                    >
                      <Ticket className="h-5 w-5 mr-2" />
                      Quiero ver mis números
                    </button>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {ticketNumbers
                      .sort((a, b) => a - b)
                      .map((number) => (
                        <TicketContainer
                          key={number}
                          ticketNumber={number}
                          digits={
                            raffle ? raffle.maxNumber.toString().length - 1 : 0
                          }
                        />
                      ))}
                  </div>
                </div>
              </div>
            )
          )}
          {send && searchResults.length === 0 && (
            <p className="text-gray-600 mt-8">
              No se registran compras con el correo electrónico: {email}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
