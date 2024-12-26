import React, { useEffect, useRef, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { PaymentDataDTO } from "@/types/paymentDataDTO";
const { VITE_MP_PUBLIC_KEY, VITE_FRONTEND_URL, VITE_EPAYCO_PUBLIC_KEY } =
  import.meta.env;
  console.log({ VITE_FRONTEND_URL });
  
initMercadoPago(VITE_MP_PUBLIC_KEY);
const handler = ePayco.checkout.configure({
  key: VITE_EPAYCO_PUBLIC_KEY,
  test: true,
});

const EPAYCO_GATEWAY = "EPAYCO";

interface PaymentButtonProps {
  paymentData: PaymentDataDTO;
  paymentGateway: string;
  preferenceId: string;
}
//

export function PaymentButton({ paymentData, paymentGateway = EPAYCO_GATEWAY, preferenceId }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const handleEPayco = () => {
    launchEpayco(paymentData);
    setLoading(true);
  };

  return paymentGateway === EPAYCO_GATEWAY ? (
    loading ? (
      <span>Cargando...</span>
    ) : (
      <button
        onClick={handleEPayco}
        type="button"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
      >
        Pagar con EPayCo
      </button>
    )
  ) : (
    <Wallet
      initialization={{ preferenceId }}
      customization={{ texts: { valueProp: "smart_option" } }}
    />
  );
}

const launchEpayco = (paymentData: PaymentDataDTO) => {
  const { formData, items } = paymentData;
  const totalPrice = items[0].quantity * items[0].unit_price;
  const description = items[0].title;
  // EPAYCO
  const data = {
    //Parametros compra (obligatorio)
    name: description,
    description: description,
    invoice: "",
    currency: "cop",
    amount: totalPrice,
    tax_base: "0",
    tax: "0",
    tax_ico: "0",
    country: "co",
    lang: "es",

    //Onpage="false" - Standard="true"
    external: "true",

    //Atributos opcionales
    extra1: "extra1",
    extra2: "extra2",
    extra3: "extra3",
    //Atributos cliente
    name_billing: formData.name,
    address_billing: "",
    type_doc_billing: "cc",
    mobilephone_billing: formData.phone,
    number_doc_billing: formData.nationalId,
    email_billing: formData.email,

    //atributo deshabilitación método de pago
    methodsDisable: ["SP", "CASH"],
  };
  handler.open(data);
};
