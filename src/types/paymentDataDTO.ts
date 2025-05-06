import { ParticipantFormData } from "./ParticipantFormData";

export type PaymentDataDTO = {
  formData: ParticipantFormData;
  items: [
    {
      title: string;
      unit_price: number;
      quantity: number;
    }
  ];
  amount?: number;
  currency?: string;
  description?: string;
  reference?: string;
  return_url?: string;
  cancel_url?: string;
  raffleId?: string;
  payer?: {
    name: string;
    email: string;
    phone: string;
    nationalId: string;
    instagram?: string;
  };
  quantity?: number;
  preferenceId?: string; // Mercado Pago
  orderId?: string; // Bold
};