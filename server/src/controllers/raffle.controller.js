import { Raffle } from "../models/raffle.js";
import { ApiError } from "../utils/ApiError.js";
import { TicketService } from "../services/ticket.service.js";
import { AvailableNumbersService } from "../services/availableNumber.service.js";
import cacheService, { CACHE_KEYS } from "../services/cache.service.js";

export const raffleController = {
  async createRaffle(req, res, next) {
    try {
      const raffleData = req.body;

      // Validate ticket range
      TicketService.validateTicketRange(
        raffleData.minNumber,
        raffleData.maxNumber
      );

      const raffle = new Raffle(raffleData);
      await raffle.save();
      res.status(201).json(raffle);
    } catch (error) {
      next(
        error instanceof ApiError
          ? error
          : new ApiError(400, "Failed to create raffle")
      );
    }
  },
  async saveAvailableNumbers(req, res, next) {
    try {
      const { min, max, raffleId } = req.body;
      const raffle = await Raffle.findById(raffleId);
      if (!raffle) {
        return next(new ApiError(404, "Raffle not found"));
      }

      // Validate ticket range
      TicketService.validateTicketRange(min, max);
      const shuffledNumbers =
        await AvailableNumbersService.populateAndShuffleNumbers(min, max);
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
      let raffles = [];
      const cachedData = cacheService.get(CACHE_KEYS.RAFFLES);
      if (cachedData) {
        raffles = cachedData;
        res.json(raffles);
        return;
      }
      raffles = await Raffle.find();
      if (Array.isArray(raffles) && raffles.length > 0) {
        cacheService.set(CACHE_KEYS.RAFFLES, raffles);
      }
      res.json(raffles);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, "Failed to fetch raffles"));
    }
  },

  async getRaffleById(req, res, next) {
    try {
      let raffle = null;
      const raffleId = req.params.id
      const cachedData = cacheService.get(raffleId);
      if (cachedData) {
        raffle = cachedData;
        res.json(raffle);
        return;
      }
      raffle = await Raffle.findById(raffleId);
      if (!raffle) {
        return next(new ApiError(404, "Raffle not found"));
      }
      if (raffle) {
        cacheService.set(raffleId, raffle);
      }
      res.json(raffle);
    } catch (error) {
      next(new ApiError(500, "Failed to fetch raffle"));
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

  async drawWinner(req, res, next) {
    try {
      const raffle = await Raffle.findById(req.params.id);
      if (!raffle) {
        return next(new ApiError(404, "Raffle not found"));
      }

      const completedParticipants = raffle.participants.filter(
        (p) => p.paymentStatus === "completed"
      );

      if (completedParticipants.length === 0) {
        return next(new ApiError(400, "No eligible participants"));
      }

      const allPaidTickets = completedParticipants.flatMap(
        (p) => p.ticketNumbers
      );
      const winningNumber = TicketService.selectRandomNumbers(
        allPaidTickets,
        1
      )[0];
      const winner = completedParticipants.find((p) =>
        p.ticketNumbers.includes(winningNumber)
      );

      raffle.winners = [winner];
      raffle.status = "completed";
      await raffle.save();

      res.json({
        raffle,
        winningNumber,
        winner,
      });
    } catch (error) {
      next(new ApiError(400, "Failed to draw winner"));
    }
  },
};
