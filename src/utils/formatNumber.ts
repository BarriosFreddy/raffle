/**
 * 
 * @param number 
 * @param digits Number of Digits
 * @returns 
 */
export function formatTicketNumber(number: number, digits: number = 0): string {
  return number.toString().padStart(digits, '0');
}

export function formatMoney(number: number): string {
  if (typeof number !== 'number') return ''
  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
  return formattedPrice
}
