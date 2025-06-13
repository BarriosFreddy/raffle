import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
const { VITE_MP_PUBLIC_KEY } =
  import.meta.env;
initMercadoPago(VITE_MP_PUBLIC_KEY);

type MercadoPagoButtonProps = {
    preferenceId: string;
}

const MercadoPagoButton = ({ preferenceId }: MercadoPagoButtonProps) => {
    return (
        <Wallet
        initialization={{ preferenceId }}
        customization={{ texts: { valueProp: "smart_option" } }}
      />
    )
}

export default MercadoPagoButton