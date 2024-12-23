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
  };
  