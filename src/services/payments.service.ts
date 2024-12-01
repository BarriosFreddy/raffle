import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_TOKEN = import.meta.env.VITE_API_TOKEN

interface PaymentData {
  raffleId: string;
  preferenceId: string;
  amount: number;
  quantity: number;
  payer: {
    name: string;
    email: string;
    phone: string;
    instagram?: string;
    nationalId?: string;
  };
}

export interface PaymentResponse {
  collection_id: string;
  collection_status: string;
  payment_id: string;
  status: string;
  external_reference: string;
  payment_type: string;
  merchant_order_id: string;
  preference_id: string;
  site_id: string;
  processing_mode: string;
  merchant_account_id: string;
}

export async function createPayment(data: PaymentData) {
  try {
    const response = await axios.post(`${API_URL}/api/payments`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    if (!response.data || !response.data._id) {
      throw new Error("Invalid payment response");
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create preference: ${error.message}`);
    }
    throw new Error("Failed to create preference");
  }
}

export async function processPaymentResponse(data: { [k: string]: string }) {
  try {
    const response = await axios.post(`${API_URL}/api/payments/webhook`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    if (!response.data || !response.data._id) {
      throw new Error("Invalid payment response");
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to save payment response: ${error.message}`);
    }
    throw new Error("Failed to save payment response");
  }
}

export async function findByEmail(email: string) {
  try {
    if (!email) return []
    const response = await axios.get(`${API_URL}/api/payments/email/${email}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to save payment response: ${error.message}`);
    }
    throw new Error("Failed to save payment response");
  }
}

export async function assignTicketNumbers(preferenceId: string) {
  try {
    if (!preferenceId) return null
    const response = await axios.post(`${API_URL}/api/payments/${preferenceId}`, {}, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to save payment response: ${error.message}`);
    }
    throw new Error("Failed to save payment response");
  }
}
