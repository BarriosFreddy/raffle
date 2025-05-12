export interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  instagram: string;
  nationalId: string;
  ticketNumbers: number[];
  paymentStatus: 'pending' | 'completed';
}

export interface Raffle {
  _id:  string;
  id: string;
  title: string;
  description: string;
  prize: string;
  minNumber: number;
  maxNumber: number;
  ticketPrice: number;
  minTicketsPerUser: number;
  maxTicketsPerUser: number;
  status: 'active' | 'inactive';
  selectedNumbers: number[];
  selectedNumbersQuantity: number;
  paymentGateway: string;
  coverUrl: string;
  themeColor?: string; // Optional theme color for UI customization
  slug: string; // URL-friendly unique identifier
  lotteryName: string; // Name of the lottery used for this raffle
  awardedNumbers: number[]; // Numbers that have been awarded prizes
  supportPhoneNumber?: string; // Support phone number for WhatsApp contact
}