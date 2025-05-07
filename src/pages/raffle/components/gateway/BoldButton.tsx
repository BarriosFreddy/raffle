import { getHashCheckout } from "@/services/bold.service";
import { PaymentDataDTO } from "@/types/paymentDataDTO";
import { useEffect, useState } from "react";
const { VITE_FRONTEND_URL, VITE_BOLD_API_KEY } = import.meta.env;

const BOLD_SCRIPT_ID = "bold-script";
const BOLD_PAYMENT_BUTTON_SRC =
  "https://checkout.bold.co/library/boldPaymentButton.js";

type HashCheckoutData = {
  hash: string;
  orderId: string;
};

type BoldButtonProps = {
  paymentData: PaymentDataDTO;
};

const BoldButton = ({ paymentData }: BoldButtonProps) => {
  const [hashCheckoutData, setHashCheckoutData] = useState<HashCheckoutData>();

  useEffect(() => {
    const buildBoldButton = async () => {
      if (paymentData?.amount && paymentData?.currency) {
        const { hash } = await getHashCheckout({
          orderId: paymentData.orderId!,
          amount: paymentData.amount,
          currency: paymentData.currency,
        });
        setHashCheckoutData({
          hash,
          orderId: paymentData.orderId!,
        });
        let script = document.getElementById(BOLD_SCRIPT_ID);
        if (script) return;
        script = document.createElement("script");
        script.id = BOLD_SCRIPT_ID;
        script.setAttribute("src", BOLD_PAYMENT_BUTTON_SRC);
        document.getElementsByTagName("head")[0].appendChild(script);
      }
    };

    buildBoldButton();
    return () => {
      const script = document.getElementById(BOLD_SCRIPT_ID);
      if (script) {
        script.remove();
      }
    };
  }, [paymentData, paymentData.amount, paymentData.currency]);

  return (
    <div className="w-full mt-4">
      <script
        data-bold-button="dark-M"
        data-order-id={hashCheckoutData?.orderId}
        data-currency="COP"
        data-amount={paymentData.amount}
        data-redirection-url={`${VITE_FRONTEND_URL}/response`}
        data-description="Compra de números"
        data-api-key={VITE_BOLD_API_KEY}
        data-integrity-signature={hashCheckoutData?.hash}
      ></script>
    </div>
  );
};

export default BoldButton;
