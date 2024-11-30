import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function getRaffleById(raffleId: string) {
  try {
    const response = await axios.get(`${API_URL}/api/raffles/${raffleId}`, {
      headers: {
        "Content-Type": "application/json",
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
