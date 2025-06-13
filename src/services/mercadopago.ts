import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_TOKEN = import.meta.env.VITE_API_TOKEN


export interface CreatePreferenceData {
  external_reference: string;
  items: Array<{
    title: string;
    unit_price: number;
    quantity: number;
  }>;
  payer: {
    name: string;
    email: string;
    phone: {
      number: string;
    };
    identification: {
      number: string;
    };
  };
}

export async function createPreference(data: CreatePreferenceData) {
  try {
    const response = await axios.post(`${API_URL}/api/create-preference`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_TOKEN}`,
      }
    });
    
    if (!response.data || !response.data.id) {
      throw new Error('Invalid preference response');
    }
    
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create preference: ${error.message}`);
    }
    throw new Error('Failed to create preference');
  }
}