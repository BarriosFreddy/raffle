import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;


export async function getHashCheckout({
  orderId,
  amount,
  currency,
}: {
  orderId: string;
  amount: number;
  currency: string;
}) {
  const response = await axios.post(
    `${API_URL}/api/bold/hash-checkout`,
    {
      orderId,
      amount,
      currency,
    },
    {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    }
  );
  return response.data;
}
