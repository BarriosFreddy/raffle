export function formatTicketNumber(number: number, maxNumber: number): string {
  const maxDigits = maxNumber.toString().length;
  return number.toString().padStart(maxDigits, '0');
}