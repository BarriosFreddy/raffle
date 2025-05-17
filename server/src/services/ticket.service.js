import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { AvailableNumber } from "../models/availableNumbers.js";
import { PaymentService } from "./payment.service.js";
import { Raffle } from "../models/raffle.js";

const TAKEN_STATUS = "taken";
const AVAILABLE_STATUS = "available";
export class TicketService {
  static async assignTicketNumbers(paymentId, quantity) {
    if (mongoose.connection.readyState !== 1) {
      console.log('Reconnecting mongodb');
      await mongoose.connect(process.env.MONGODB_URI);
    }
    const session = await mongoose.startSession();

    let transactionInProgress = false; // State tracker
    try {
      session.startTransaction();
      transactionInProgress = true;

      const payment = await PaymentService.findOne({
        _id: paymentId,
      });

      // Fetch raffle data
      const raffle = await Raffle.findOne({
        _id: payment.raffleId,
      }).exec();
      
      let selectedNumbers = [];

      // First, check if there are any prioritized awarded numbers to assign
      if (raffle.priorityAwardedNumbers && raffle.priorityAwardedNumbers.length > 0) {
        // Use prioritized awarded numbers first
        const priorityCount = Math.min(raffle.priorityAwardedNumbers.length, quantity);
        selectedNumbers = raffle.priorityAwardedNumbers.slice(0, priorityCount);
        
        // Remove these numbers from priorityAwardedNumbers
        const priorityAwardedNumbersNew = [...raffle.priorityAwardedNumbers];
        priorityAwardedNumbersNew.splice(0, priorityCount);
        raffle.priorityAwardedNumbers = priorityAwardedNumbersNew;
        await raffle.save({ session });
        
        // If we've satisfied the quantity with unblocked awarded numbers, we're done
        if (selectedNumbers.length <= quantity) {
          // Find and update the availableNumber records for these numbers
          await AvailableNumber.updateMany(
            { raffleId: payment.raffleId, number: { $in: selectedNumbers }, status: AVAILABLE_STATUS },
            { $set: { status: TAKEN_STATUS } },
            { session }
          );
        }
      }
      
      // If we still need more numbers, get regular available numbers
      const remainingQuantity = quantity - selectedNumbers.length;
      
      if (remainingQuantity > 0) {
        // Get regular available numbers, excluding blocked numbers
        const availableNumbers = await AvailableNumber.find(
          { 
            raffleId: payment.raffleId, 
            status: AVAILABLE_STATUS,
            number: { $nin: raffle.blockedNumbers || [] } 
          },
          null,
          {
            limit: remainingQuantity,
          }
        ).exec();
        
        // Add these to our selected numbers
        const additionalNumbers = availableNumbers.map(({ number }) => number);
        selectedNumbers = [...selectedNumbers, ...additionalNumbers];
        
        // Mark these as taken
        const availableNumberIds = availableNumbers.map(({ _id }) => _id);
        await AvailableNumber.updateMany(
          { _id: { $in: availableNumberIds } },
          { $set: { status: TAKEN_STATUS } },
          { session }
        );
      }

      // Update the payment with the selected numbers
      payment.ticketNumbers = selectedNumbers;
      await payment.save({ session });
      
      // Update raffle's selected numbers count
      raffle.selectedNumbersQuantity = raffle.selectedNumbersQuantity + quantity;
      await raffle.save({ session });

      if (selectedNumbers.length < quantity) {
        throw new ApiError(
          400,
          "There are not sufficient available numbers to assign. Currently, there are " +
            selectedNumbers.length +
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
  
  /**
   * Get all assigned numbers for a specific raffle
   * @param {string} raffleId - The ID of the raffle
   * @returns {Promise<number[]>} - Array of assigned ticket numbers
   */
  static async getAssignedNumbers(raffleId) {
    try {
      // Find all available numbers that are marked as 'taken'
      const takenNumbers = await AvailableNumber.find(
        { raffleId, status: TAKEN_STATUS },
        'number' // only return the number field
      ).exec();
      
      // Extract and return just the numbers
      return takenNumbers.map(item => item.number);
    } catch (error) {
      console.error("Error getting assigned numbers:", error);
      return [];
    }
  }
}

