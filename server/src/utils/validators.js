import { ApiError } from './ApiError.js';

export class Validators {
  static validateEnvVariables(requiredVars) {
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(", ")}`
      );
    }
  }

  static validatePaymentWebhook(payload) {
    const requiredFields = [
      'payment_id',
    ];

    const missingFields = requiredFields.filter(field => !payload[field]);
    
    if (missingFields.length > 0) {
      throw new ApiError(
        400,
        `Missing required webhook fields: ${missingFields.join(", ")}`
      );
    }
  }

  static validateParticipant(participant) {
    const requiredFields = ['name', 'email', 'phone', 'nationalId'];
    
    const missingFields = requiredFields.filter(
      field => !participant[field] || participant[field].trim() === ''
    );
    
    if (missingFields.length > 0) {
      throw new ApiError(
        400,
        `Missing required participant fields: ${missingFields.join(", ")}`
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(participant.email)) {
      throw new ApiError(400, 'Invalid email format');
    }

    // Validate phone format (Colombian numbers)
    const phoneRegex = /^3[0-9]{9}$/;
    if (!phoneRegex.test(participant.phone)) {
      throw new ApiError(400, 'Invalid phone number format');
    }
  }
}