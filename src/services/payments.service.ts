import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

interface PaymentData {
  raffleId: string;
  preferenceId?: string; // Mercado Pago
  orderId?: string; // Bold
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
    console.error(error);
    return null;
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

export async function processPaymentEPayco(refPayco: string) {
  try {
    const response = await axios.get(
      `https://secure.epayco.co/validation/v1/reference/${refPayco}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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
    if (!email) return [];
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

export async function findAll(params: { [key: string]: any }) {
  try {
    const response = await axios.get(`${API_URL}/api/payments`, {
      params,
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

export async function assignTicketNumbers({
  paymentId,
  preferenceId,
  email,
}: AssignTicketParams) {
  try {
    const data: AssignTicketParams = {};
    if (paymentId) data.paymentId = paymentId;
    if (preferenceId) data.preferenceId = preferenceId;
    if (email) data.email = email;

    const response = await axios.post(
      `${API_URL}/api/payments/assign`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to save payment response: ${error.message}`);
    }
    throw new Error("Failed to save payment response");
  }
}

export async function getBoldRecordByOrderId(orderId: string) {
  try {
    if (!orderId) return;

    const response = await axios.get(
      `${API_URL}/api/payments/bold/status/${orderId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to find bold payment response: ${error.message}`);
    }
    throw new Error("Failed to find bold payment");
  }
}

export async function getMercadoPagoPaymentByOrderId(orderId: string) {
  try {
    if (!orderId) return;

    const response = await axios.get(
      `${API_URL}/api/payments/mercado-pago/status/${orderId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to find mercado pago payment response: ${error.message}`);
    }
    throw new Error("Failed to find mercado pago payment");
  }
}

type AssignTicketParams = { paymentId?: string; preferenceId?: string; email?: string };
