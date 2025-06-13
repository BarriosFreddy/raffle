import { Raffle } from "../models/raffle.js";
import { ApiError } from "../utils/ApiError.js";
import { TicketService } from "../services/ticket.service.js";
import { AvailableNumbersService } from "../services/availableNumber.service.js";
import cacheService, { CACHE_KEYS } from "../services/cache.service.js";
import * as RaffleService from "../services/raffle.service.js";
import { PaymentService } from "../services/payment.service.js"
import { logger } from "../utils/logger.js";

export const raffleController = {
  async getLiveRaffleById(req, res, next) {
    try {
      const { id } = req.params;
      
      // Skip cache and get directly from database
      const raffle = await Raffle.findById(id);
      if (!raffle) {
        return next(new ApiError(404, "Raffle not found"));
      }

      res.json(raffle);
      logger.info(`Retrieved live raffle data with ID: ${id}`);
    } catch (error) {
      logger.error(`Error getting live raffle data with ID ${req.params.id}:`, error);
      next(new ApiError(400, "Failed to get live raffle data"));
    }
  },

  async getLiveRaffleBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      
      // Skip cache and get directly from database
      const raffle = await Raffle.findOne({ slug }).exec();
      if (!raffle) {
        return next(new ApiError(404, "Raffle not found"));
      }

      res.json(raffle);
      logger.info(`Retrieved live raffle data with slug: ${slug}`);
    } catch (error) {
      logger.error(`Error getting live raffle data with slug ${req.params.slug}:`, error);
      next(error instanceof ApiError ? error : new ApiError(400, "Failed to get live raffle data"));
    }
  },
  async createRaffle(req, res, next) {
    try {
      const raffleData = req.body;

      // Validate ticket range
      TicketService.validateTicketRange(
        raffleData.minNumber,
        raffleData.maxNumber
      );

      const raffle = await RaffleService.createRaffle(raffleData);
      cacheService.deleteAll();
      res.status(201).json(raffle);
      logger.info(`Raffle created with ID: ${raffle._id}`);
    } catch (error) {
      logger.error("Error creating raffle:", error);
      next(new ApiError(400, "Failed to create raffle"));
    }
  },
  async updateRaffle(req, res, next) {
    try {
      const raffleId = req.params.id;
      // Validate ticket range
      TicketService.validateTicketRange(
        req.body.minNumber,
        req.body.maxNumber
      );
      const updatedRaffle = await RaffleService.updateRaffle(raffleId, req.body);
      cacheService.deleteAll();
      res.status(200).json(updatedRaffle);
      logger.info(`Raffle updated with ID: ${raffleId}`);
    } catch (error) {
      logger.error("Error updating raffle:", error);
      next(new ApiError(400, "Failed to update raffle"));
    }
  },

  async saveAvailableNumbers(req, res, next) {
    try {
      const { raffleId } = req.body;
      const raffle = await Raffle.findById(raffleId);
      if (!raffle) {
        return next(new ApiError(404, "Raffle not found"));
      }

      // Validate ticket range
      TicketService.validateTicketRange(raffle.minNumber, raffle.maxNumber);
      const shuffledNumbers =
        await AvailableNumbersService.populateAndShuffleNumbers(raffle.minNumber, raffle.maxNumber);
      const availableNumbersdocs =
        await AvailableNumbersService.generateAvailableNumberDocs(
          shuffledNumbers,
          raffleId
        );
      const response = await AvailableNumbersService.bulkInsert(
        availableNumbersdocs
      );

      res.status(201).json(response);
    } catch (error) {
      console.error(error);
      next(
        error instanceof ApiError
          ? error
          : new ApiError(400, "Failed to create raffle")
      );
    }
  },

  async getRaffles(req, res, next) {
    try {
      const { status, page, size } = req.query;
      let raffles = [];
      
      // Try to get from cache first
      const cacheKey = `${CACHE_KEYS.RAFFLES}:${[status, page, size].join("_")}`;
      const cachedData = cacheService.get(cacheKey);
      if (cachedData) {
        raffles = cachedData;
        res.json(raffles);
        return;
      }

      // Get from database if not in cache
      raffles = await RaffleService.getRaffles({ status, page, size });
      
      // Cache the results if there are any
      if (Array.isArray(raffles) && raffles.length > 0) {
        cacheService.set(cacheKey, raffles);
      }

      res.json(raffles);
      logger.info(`Retrieved ${raffles.length} raffles`);
    } catch (error) {
      logger.error("Error getting raffles:", error);
      next(new ApiError(400, "Failed to get raffles"));
    }
  },

  async getRaffleById(req, res, next) {
    try {
      const { id } = req.params;
      
      // Try to get from cache first
      const cacheKey = `${CACHE_KEYS.RAFFLE}:${id}`;
      const cachedData = cacheService.get(cacheKey);
      if (cachedData) {
        res.json(cachedData);
        return;
      }

      // Get from database if not in cache
      const raffle = await Raffle.findById(id);
      if (!raffle) {
        return next(new ApiError(404, "Raffle not found"));
      }

      // Cache the result
      cacheService.set(cacheKey, raffle);

      res.json(raffle);
      logger.info(`Retrieved raffle with ID: ${id}`);
    } catch (error) {
      logger.error(`Error getting raffle with ID ${req.params.id}:`, error);
      next(new ApiError(400, "Failed to get raffle"));
    }
  },

  async getRaffleBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      
      // Try to get from cache first
      const cacheKey = `${CACHE_KEYS.RAFFLE_SLUG}:${slug}`;
      const cachedData = cacheService.get(cacheKey);
      if (cachedData) {
        res.json(cachedData);
        return;
      }

      // Get from database if not in cache
      const raffle = await RaffleService.getRaffleBySlug(slug);

      // Cache the result
      cacheService.set(cacheKey, raffle);

      res.json(raffle);
      logger.info(`Retrieved raffle with slug: ${slug}`);
    } catch (error) {
      logger.error(`Error getting raffle with slug ${req.params.slug}:`, error);
      next(error instanceof ApiError ? error : new ApiError(400, "Failed to get raffle"));
    }
  },

  async addParticipant(req, res, next) {
    try {
      const raffle = await Raffle.findById(req.params.id);
      if (!raffle) {
        return next(new ApiError(404, "Raffle not found"));
      }

      raffle.participants.push(req.body);
      await raffle.save();

      res.json(raffle);
    } catch (error) {
      next(new ApiError(400, "Failed to add participant"));
    }
  },

  async updatePaymentStatus(req, res, next) {
    try {
      const { raffleId, participantId } = req.params;
      const { quantity } = req.body;

      const raffle = await Raffle.findById(raffleId);
      if (!raffle) {
        return next(new ApiError(404, "Raffle not found"));
      }

      const selectedNumbers = await TicketService.assignTicketNumbers(
        raffle,
        participantId,
        quantity
      );

      await raffle.save();
      res.json({ raffle, selectedNumbers });
    } catch (error) {
      next(
        error instanceof ApiError
          ? error
          : new ApiError(400, "Failed to update payment status")
      );
    }
  },

  async checkAvailableNumbers(req, res, next) {
    try {
      const { raffleId } = req.params;
      const hasNumbers = await AvailableNumbersService.hasAvailableNumbers(raffleId);
      res.json({ hasNumbers });
      logger.info(`Checked available numbers for raffle ${raffleId}`);
    } catch (error) {
      logger.error("Error checking available numbers:", error);
      next(new ApiError(400, "Failed to check available numbers"));
    }
  },

  async updateAwardedNumbers(req, res, next) {
    try {
      const { raffleId } = req.params;
      const { awardedNumbers } = req.body;
      
      if (!Array.isArray(awardedNumbers)) {
        return next(new ApiError(400, "awardedNumbers must be an array of numbers"));
      }

      // Validate that all numbers are within the raffle range
      const raffle = await Raffle.findById(raffleId);
      if (!raffle) {
        return next(new ApiError(404, "Raffle not found"));
      }

      // Check if all numbers are in the valid range
      const validNumbers = awardedNumbers.every(num => 
        num >= raffle.minNumber && num <= raffle.maxNumber
      );

      if (!validNumbers) {
        return next(new ApiError(400, "All awarded numbers must be within the raffle's number range"));
      }

      // Update the raffle with the awarded numbers
      const updatedRaffle = await RaffleService.updateRaffle(raffleId, { awardedNumbers });
      
      // Clear the cache for this raffle
      cacheService.delete(`${CACHE_KEYS.RAFFLE}:${raffleId}`);
      cacheService.delete(`${CACHE_KEYS.RAFFLE_SLUG}:${updatedRaffle.slug}`);
      
      res.status(200).json(updatedRaffle);
      logger.info(`Updated awarded numbers for raffle ${raffleId}: ${awardedNumbers.join(', ')}`);
    } catch (error) {
      logger.error("Error updating awarded numbers:", error);
      next(new ApiError(400, "Failed to update awarded numbers"));
    }
  },
  async getAwardedNumbersWinners(req, res, next) {
    try {
      const { raffleId } = req.params;
      // Validate that all numbers are within the raffle range
      const raffle = await Raffle.findById(raffleId);
      if (!raffle) {
        return next(new ApiError(404, "Raffle not found"));
      }

      // Update the raffle with the awarded numbers
      const winners = await PaymentService.getAwardedNumbersWinners(raffleId, raffle.awardedNumbers);
      
      // Clear the cache for this raffle
      res.status(200).json(winners);
      logger.info(`Get awarded numbers winners for raffle ${raffleId}`);
    } catch (error) {
      logger.error("Error getting awarded numbers winners:", error);
      next(new ApiError(400, "Failed to get awarded numbers winners"));
    }
  },
};
