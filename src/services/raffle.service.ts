import { Raffle } from "@/types";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_TOKEN = import.meta.env.VITE_API_TOKEN

export async function getRaffleById(raffleId: string) {
  try {
    const response = await axios.get(`${API_URL}/api/raffles/${raffleId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    if (!response.data || !response.data._id) {
      throw new Error("Invalid raffle response");
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get raffle: ${error.message}`);
    }
    throw new Error("Failed to get raffle");
  }
}
export async function getRaffles() {
  try {
    const response = await axios.get(`${API_URL}/api/raffles`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get raffle: ${error.message}`);
    }
    throw new Error("Failed to get raffle");
  }
}

export async function saveRaffle(raffle: Raffle) {
  try {
    const response = await axios.post(`${API_URL}/api/raffles`, raffle, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    if (!response.data || !response.data._id) {
      throw new Error("Invalid raffle response");
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to save raffle: ${error.message}`);
    }
    throw new Error("Failed to save raffle");
  }
}
