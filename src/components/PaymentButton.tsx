import React, { useEffect, useRef, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
const { VITE_MP_PUBLIC_KEY } = import.meta.env;
initMercadoPago(VITE_MP_PUBLIC_KEY);

interface PaymentButtonProps {
  preferenceId: string;
}

export function PaymentButton({
  preferenceId
}: PaymentButtonProps) {
  return preferenceId ? (
    <Wallet
      initialization={{ preferenceId }}
      customization={{ texts: { valueProp: "smart_option" } }}
    />
  ) : <span>Cargando...</span>;
}
