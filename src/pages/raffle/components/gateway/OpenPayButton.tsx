import { useState, useEffect, useRef } from "react";
import { PaymentDataDTO } from "@/types/paymentDataDTO";
import { createOpenPayPaymentLink } from "@/services/openpay.service";

type OpenPayButtonProps = {
  paymentData: PaymentDataDTO;
};

const OpenPayButton = ({ paymentData }: OpenPayButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const sendingCreatePaymentLinkRef = useRef(false);

  useEffect(() => {
    const generatePaymentLink = async () => {
      if (!paymentData.orderId || !paymentData.amount || !paymentData.formData) {
        setError("Missing required payment data");
        return;
      }

      setLoading(true);
      setError(null);
      if (sendingCreatePaymentLinkRef.current) return;

      try {
        sendingCreatePaymentLinkRef.current = true;
        const response = await createOpenPayPaymentLink({
          amount: paymentData.amount,
          orderId: paymentData.orderId,
          customer: {
            name: paymentData.formData.name,
            email: paymentData.formData.email,
            phone: paymentData.formData.phone,
          },
          description: paymentData.description || `Compra de ${paymentData.quantity} tickets`,
        });

        setPaymentUrl(response.paymentUrl);
      } catch (err) {
        console.error("Error generating OpenPay payment link:", err);
        setError("No se pudo generar el enlace de pago. Por favor, inténtelo de nuevo.");
      } finally {
        setLoading(false);
        sendingCreatePaymentLinkRef.current = false;
      }
    };

    generatePaymentLink();
  }, [paymentData]);

  const handlePayment = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  };

  if (loading) {
    return (
      <div className="w-full mt-4 py-3 bg-gray-100 text-center text-gray-700 rounded-md">
        Preparando pasarela de pago...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mt-4 py-3 bg-red-100 text-center text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  if (!paymentUrl) {
    return null;
  }

  return (
    <div className="w-full mt-4">
      <button
        onClick={handlePayment}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
      >
        Pagar con Open Pay (BBVA)
      </button>
    </div>
  );
};

export default OpenPayButton;
