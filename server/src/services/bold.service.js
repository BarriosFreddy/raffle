import crypto from "crypto";
import dotenv from "dotenv";
// Load environment variables
dotenv.config();
const BOLD_API_SECRET = process.env.BOLD_API_SECRET;

/**
 * Create hash integrity for bold checkout
 * @param {Object} params - { amount, currency, description, reference, return_url, cancel_url }
 * @returns {Promise<{ hash: string }>}
 */
export async function getHashCheckout({ orderId, amount, currency }) {
  try {
    const data = `${orderId}${amount}${currency}${BOLD_API_SECRET}`;
    const encodedText = new TextEncoder().encode(data);

    // Generar el hash SHA-256
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedText);

    // Convertir el buffer del hash en un array de bytes
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // Convertir cada byte en una representación hexadecimal y unirlos en una sola cadena
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  } catch (error) {
    console.error("Failed to create BOLD hash integrity", error);
    throw error;
  }
}
