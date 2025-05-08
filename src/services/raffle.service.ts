import { Raffle } from "@/types";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_TOKEN = import.meta.env.VITE_API_TOKEN

export async function getRaffleBySlug(slug: string) {
  try {
    const response = await axios.get(`${API_URL}/api/raffles/slug/${slug}`, {
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
      throw new Error(`Failed to get raffle by slug: ${error.message}`);
    }
    throw new Error("Failed to get raffle by slug");
  }
}

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
export async function getRaffles(query?: { status?: string, page?: number, size?: number }) {
  try {
    const params: Record<string, string> = {}
    if (query?.size) params.size = query.size.toString();
    if (query?.page) params.page = query.page.toString();
    if (query?.status) params.status = query.status.toString();
    const response = await axios.get(`${API_URL}/api/raffles${query ? `?${new URLSearchParams(params).toString()}` : ""}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get raffles: ${error.message}`);
    }
    throw new Error("Failed to get raffles");
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

export async function updateRaffle(raffleId: string, raffle: Partial<Raffle>) {
  try {
    const response = await axios.put(`${API_URL}/api/raffles/${raffleId}`, raffle, {
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
      throw new Error(`Failed to update raffle: ${error.message}`);
    }
    throw new Error("Failed to update raffle");
  }
}

export async function assignAvailableNumbers(raffleId: string) {
  try {
    const response = await axios.post(`${API_URL}/api/raffles/numbers/assign`, { raffleId }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to assign numbers: ${error.message}`);
    }
    throw new Error("Failed to assign numbers");
  }
}

export async function checkAvailableNumbers(raffleId: string): Promise<boolean> {
  try {
    const response = await axios.get(`${API_URL}/api/raffles/${raffleId}/available-numbers`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return response.data.hasNumbers;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to check available numbers: ${error.message}`);
    }
    throw new Error("Failed to check available numbers");
  }
}
