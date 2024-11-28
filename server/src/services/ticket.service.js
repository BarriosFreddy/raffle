import { ApiError } from '../utils/ApiError.js';

export class TicketService {
  static validateTicketRange(minNumber, maxNumber) {
    if (minNumber >= maxNumber) {
      throw new ApiError(400, 'Invalid ticket range: minimum number must be less than maximum number');
    }
    if (minNumber < 0) {
      throw new ApiError(400, 'Invalid ticket range: minimum number cannot be negative');
    }
  }

  static getAvailableNumbers(minNumber, maxNumber, selectedNumbers = []) {
    this.validateTicketRange(minNumber, maxNumber);
    
    const allNumbers = Array.from(
      { length: maxNumber - minNumber + 1 },
      (_, i) => i + minNumber
    );
    
    return allNumbers.filter(num => !selectedNumbers.includes(num));
  }

  static selectRandomNumbers(availableNumbers, quantity) {
    if (availableNumbers.length < quantity) {
      throw new ApiError(400, 'Not enough available numbers for the requested quantity');
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

  static async assignTicketNumbers(raffle, quantity) {
    const availableNumbers = this.getAvailableNumbers(
      raffle.minNumber,
      raffle.maxNumber,
      raffle.selectedNumbers
    );

    const selectedNumbers = this.selectRandomNumbers(availableNumbers, quantity);
    return selectedNumbers;
  }
}