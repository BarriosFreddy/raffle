import { useState } from "react";
import { PaymentDataDTO } from "@/types/paymentDataDTO";

const { VITE_EPAYCO_PUBLIC_KEY, VITE_EPAYCO_TEST } = import.meta.env;

type EPayCoButtonProps = {
  paymentData: PaymentDataDTO;
};

const handler = ePayco.checkout.configure({
  key: VITE_EPAYCO_PUBLIC_KEY,
  test: VITE_EPAYCO_TEST,
});

const EPayCoButton = ({ paymentData }: EPayCoButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleEPayco = () => {
    launchEpayco();
    setLoading(true);
  };

  const launchEpayco = () => {
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

  return loading ? (
    <span>Cargando...</span>
  ) : (
    <button
      onClick={handleEPayco}
      type="button"
      className="w-full bg-slate-600 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-slate-700 active:bg-slate-800 transition-colors"
    >
      Pagar con EPayCo
    </button>
  );
};

export default EPayCoButton;
