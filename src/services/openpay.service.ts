import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

type CreatePaymentLinkParams = {
  amount: number;
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  description?: string;
};

type PaymentLinkResponse = {
  paymentUrl: string;
  orderId: string;
  id: string;
};

export async function createOpenPayPaymentLink(params: CreatePaymentLinkParams): Promise<PaymentLinkResponse> {
  try {
    const response = await axios.post(
      `${API_URL}/api/openpay/payment-link`,
      params,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create OpenPay payment link: ${error.message}`);
    }
    throw new Error("Failed to create OpenPay payment link");
  }
}
