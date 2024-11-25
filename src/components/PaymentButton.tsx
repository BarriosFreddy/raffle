import React, { useEffect, useState } from "react";
import { createPreference } from "../services/mercadopago";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
const { VITE_MP_PUBLIC_KEY } = import.meta.env;
initMercadoPago(VITE_MP_PUBLIC_KEY);

interface PaymentButtonProps {
  title: string;
  price: number;
  quantity: number;
  name: string;
  email: string;
  phone: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export function PaymentButton({
  title,
  price,
  quantity,
  name,
  email,
  phone,
  onSuccess,
  onError,
}: PaymentButtonProps) {
  const [preferenceId, setPreferenceId] = useState("");

  useEffect(() => {
    const initMercadoPago = async () => {
      try {
        const preference = await createPreference({
          items: [
            {
              title,
              unit_price: price,
              quantity,
            },
          ],
          payer: {
            name,
            email,
            phone: {
              number: phone,
            },
          },
        });

        setPreferenceId(preference.id);
      } catch (error) {
        console.error("Payment initialization error:", error);
        onError?.(error);
      }
    };

    initMercadoPago();
  }, [title, price, quantity, name, email, phone, onSuccess, onError]);

  return preferenceId ? (
    <Wallet
      initialization={{ preferenceId }}
      customization={{ texts: { valueProp: "smart_option" } }}
    />
  ) : <span>Cargando...</span>;
}
