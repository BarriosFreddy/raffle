import { PaymentDataDTO } from "@/types/paymentDataDTO";
import BoldButton from "./gateway/BoldButton";
import MercadoPagoButton from "./gateway/MercadoPagoButton";
import EPayCoButton from "./gateway/EPayCoButton";
import OpenPayButton from "./gateway/OpenPayButton";
import { PaymentGateway } from "@/enums/PaymentGateway.enum";

interface PaymentButtonProps {
  paymentData: PaymentDataDTO;
  paymentGateway: PaymentGateway;
}

export function PaymentButton({
  paymentData,
  paymentGateway = PaymentGateway.BOLD,
}: PaymentButtonProps) {
  if (paymentGateway === PaymentGateway.EPAYCO) {
    return <EPayCoButton paymentData={paymentData} />;
  } else if (paymentGateway === PaymentGateway.BOLD) {
    return <BoldButton paymentData={paymentData} />;
  } else if (paymentGateway === PaymentGateway.MERCADO_PAGO) {
    return <MercadoPagoButton preferenceId={paymentData.preferenceId!} />;
  } else if (paymentGateway === PaymentGateway.OPEN_PAY) {
    return <OpenPayButton paymentData={paymentData} />;
  }
  return null;
}
