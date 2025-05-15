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

// New method to get live raffle data by slug (bypasses cache)
export async function getLiveRaffleBySlug(slug: string) {
  try {
    const response = await axios.get(`${API_URL}/api/raffles/live/slug/${slug}`, {
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
      throw new Error(`Failed to get live raffle by slug: ${error.message}`);
    }
    throw new Error("Failed to get live raffle by slug");
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

// New method to get live raffle data by ID (bypasses cache)
export async function getLiveRaffleById(raffleId: string) {
  try {
    const response = await axios.get(`${API_URL}/api/raffles/live/${raffleId}`, {
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
      throw new Error(`Failed to get live raffle: ${error.message}`);
    }
    throw new Error("Failed to get live raffle");
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
      throw new Error(`Failed to assign available numbers: ${error.message}`);
    }
    throw new Error("Failed to assign available numbers");
  }
}

export async function updateAwardedNumbers(raffleId: string, awardedNumbers: number[]) {
  try {
    const response = await axios.put(`${API_URL}/api/raffles/${raffleId}/awarded-numbers`, { awardedNumbers }, {
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
      throw new Error(`Failed to update awarded numbers: ${error.message}`);
    }
    throw new Error("Failed to update awarded numbers");
  }
}

export async function updateBlockedNumbers(raffleId: string, blockedNumbers: number[]) {
  try {
    const response = await axios.put(`${API_URL}/api/raffles/${raffleId}/blocked-numbers`, { blockedNumbers }, {
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
      throw new Error(`Failed to update blocked numbers: ${error.message}`);
    }
    throw new Error("Failed to update blocked numbers");
  }
}

export async function getAwardedNumbersWinners(raffleId: string) {
  try {
    const response = await axios.get(`${API_URL}/api/raffles/${raffleId}/awarded-numbers/winners`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    if (!response.data) {
      throw new Error("Invalid raffle response");
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get awarded numbers winners: ${error.message}`);
    }
    throw new Error("Failed to get awarded numbers winners");
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
