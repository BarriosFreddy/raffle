export function formatTicketNumber(number: number, maxNumber: number): string {
  const maxDigits = maxNumber.toString().length;
  return number.toString().padStart(maxDigits, '0');
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