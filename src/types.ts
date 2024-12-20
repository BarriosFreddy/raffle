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
  participants: Participant[];
  winners: Participant[];
  status: 'active' | 'completed';
  selectedNumbers: number[];
  selectedNumbersQuantity: number;
}