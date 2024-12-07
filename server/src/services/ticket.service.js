import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { AvailableNumber } from "../models/availableNumbers.js";
import { PaymentService } from "./payment.service.js";
import { Raffle } from "../models/raffle.js";

const TAKEN_STATUS = "taken";
const AVAILABLE_STATUS = "available";
export class TicketService {
  static async assignTicketNumbers(paymentId, quantity) {
    const session = await mongoose.startSession();
    let transactionInProgress = false; // State tracker
    try {
      session.startTransaction();
      transactionInProgress = true;

      let selectedNumbers = [];
      const payment = await PaymentService.findOne({
        _id: paymentId,
      });

      const raffle = await Raffle.findOne({
        _id: payment.raffleId,
      }).exec();

      const availableNumbers = await AvailableNumber.find(
        { status: AVAILABLE_STATUS },
        null,
        {
          limit: quantity,
        }
      ).exec();

      selectedNumbers = availableNumbers.map(({ number }) => number);
      const availableNumberIds = availableNumbers.map(({ _id }) => _id);
      await AvailableNumber.updateMany(
        { _id: { $in: availableNumberIds } },
        { $set: { status: TAKEN_STATUS } },
        { session }
      );

      payment.ticketNumbers = selectedNumbers;
      await payment.save({ session });
      raffle.selectedNumbersQuantity =
        raffle.selectedNumbersQuantity + quantity;
      await raffle.save({ session });

      if (availableNumbers.length < quantity) {
        throw new ApiError(
          400,
          "There are not sufficient available numbers to assign. Currently, there are " +
            availableNumbers.length +
            " available"
        );
      }

      console.log("Transaction is in progress:", transactionInProgress);
      await session.commitTransaction();
      transactionInProgress = false; // Transaction successfully committed
      console.log("Transaction committed successfully.");
      return payment;
    } catch (e) {
      if (transactionInProgress) {
        await session.abortTransaction();
        console.error("Transaction aborted due to error:", e);
      }
    } finally {
      session.endSession();
      console.log("Session ended.");
    }
  }

  static validateTicketRange(minNumber, maxNumber) {
    if (minNumber >= maxNumber) {
      throw new ApiError(
        400,
        "Invalid ticket range: minimum number must be less than maximum number"
      );
    }
    if (minNumber < 0) {
      throw new ApiError(
        400,
        "Invalid ticket range: minimum number cannot be negative"
      );
    }
  }

  /*   static getAvailableNumbers(minNumber, maxNumber, selectedNumbers = []) {
    this.validateTicketRange(minNumber, maxNumber);
    
    const allNumbers = Array.from(
      { length: maxNumber - minNumber + 1 },
      (_, i) => i + minNumber
    );
    
    return allNumbers.filter(num => !selectedNumbers.includes(num));
  } */

  static selectRandomNumbers(availableNumbers, quantity) {
    if (availableNumbers.length < quantity) {
      throw new ApiError(
        400,
        "Not enough available numbers for the requested quantity"
      );
    }

    const selectedNumbers = [];
    const numbers = [...availableNumbers];

    // Fisher-Yates shuffle algorithm for better randomization
    for (let i = 0; i < quantity; i++) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      selectedNumbers.push(numbers[randomIndex]);
      numbers.splice(randomIndex, 1);
    }

    return selectedNumbers.sort((a, b) => a - b);
  }
}
