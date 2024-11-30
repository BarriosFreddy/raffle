import { AvailableNumber } from "../models/availableNumbers.js";
import _ from "lodash";

export class AvailableNumbersService {
  static async create(availableNumberData) {
    const availableNumber = new AvailableNumber(availableNumberData);
    const availableNumberSaved = await availableNumber.save();
    return availableNumberSaved;
  }
  static async bulkInsert(availableNumbersData) {
    if (!availableNumbersData) return;
    const availableNumberResponse = await AvailableNumber.insertMany(
      availableNumbersData
    );
    return availableNumberResponse;
  }
  static async generateAvailableNumberDocs(availableNumbersData, raffleId) {
    let availableNumbers = [];
    if (Array.isArray(availableNumbersData) && !!availableNumbersData.length) {
      for (const number of availableNumbersData) {
        availableNumbers.push({
          raffleId,
          number,
        });
      }
    }
    return availableNumbers;
  }
  static async populateAndShuffleNumbers(min, max) {
    let shuflledNumbers = [];
    const orderedNumbers = Array.from({ length: max - min }, (_, i) => i + min);
    shuflledNumbers = _.shuffle(orderedNumbers);
    console.log({ shuflledNumbers });
    return shuflledNumbers;
  }
}
