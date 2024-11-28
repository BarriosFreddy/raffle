import { MercadoPagoConfig, Preference } from "mercadopago";
import { ApiError } from '../utils/ApiError.js';

export class MercadoPagoService {
  static async createPreference({ items, payer }) {
    try {
      if (!items?.length || !payer) {
        throw new ApiError(400, "Invalid request data");
      }
      const client = new MercadoPagoConfig({
        accessToken: process.env.MP_ACCESS_TOKEN,
      });
      
      const preference = new Preference(client);
      const body = {
        payer,
        items,
        payment_methods: {
          excluded_payment_types: [
            {
              id: "ticket"
            }
          ],
          installments: 1
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL}/success`,
          failure: `${process.env.FRONTEND_URL}/failure`,
          pending: `${process.env.FRONTEND_URL}/pending`,
        },
        auto_return: "approved",
        statement_descriptor: "Raffle",
        expires: true,
        expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
      };

      const result = await preference.create({ body });
      return result;
    } catch (error) {
      throw new ApiError(
        500,
        `Failed to create MercadoPago preference: ${error.message}`
      );
    }
  }
  static async findPreferenceById(preferenceId) {
    try {

      const client = new MercadoPagoConfig({
        accessToken: process.env.MP_ACCESS_TOKEN,
      });
      
      const preference = new Preference(client);

      const result = await preference.get({ preferenceId });
      return result;
    } catch (error) {
      throw new ApiError(
        500,
        `Failed to create MercadoPago preference: ${error.message}`
      );
    }
  }
}