import axios from "axios";
import { ApiError } from "../utils/ApiError.js";

// Get environment variables
const {
  OPENPAY_API_KEY,
  OPENPAY_MERCHANT_ID,
  FRONTEND_URL,
  OPENPAY_API_SECRET,
  OPENPAY_API_URL,
} = process.env;

// Base64 encode the API key for Basic Auth
const getBasicAuth = () => {
  return Buffer.from(`${OPENPAY_API_KEY}:`).toString("base64");
};

export class OpenPayService {
  static getBaseUrl() {
    // For Colombia, use the .co domain
    return `${OPENPAY_API_URL}/${OPENPAY_MERCHANT_ID}`;
  }

  static async createPaymentLink(paymentData) {
    console.log({ OPENPAY_API_KEY, OPENPAY_MERCHANT_ID, FRONTEND_URL });

    try {
      if (!paymentData) {
        throw new ApiError(400, "Invalid payment data");
      }

      const { amount, orderId, customer, description } = paymentData;

      if (!amount || !orderId || !customer) {
        throw new ApiError(400, "Missing required payment data fields");
      }

      const url = `${this.getBaseUrl()}/checkouts`;

      const checkoutData = {
        amount: parseFloat(amount),
        currency: "COP", // For Colombia
        description: description || "Compra de tickets para rifa",
        order_id: orderId,
        redirect_url: `${FRONTEND_URL}/response?bold-order-id=${orderId}`,
        customer: {
          name: customer.name,
          email: customer.email,
          phone_number: customer.phone,
        },
        send_email: false,
      };

      const response = await axios.post(url, checkoutData, {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${OPENPAY_API_SECRET}:`
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
      });

      return {
        paymentUrl: response.data.checkout_link,
        orderId: response.data.order_id,
        id: response.data.id,
      };
    } catch (error) {
      console.error(
        "OpenPay API Error:",
        error.response?.data || error.message
      );
      throw new ApiError(
        error.response?.status || 500,
        error.response?.data?.description ||
          "Error creating OpenPay payment link"
      );
    }
  }
}
