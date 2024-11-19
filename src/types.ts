export interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  ticketNumbers: number[];
}

export interface Raffle {
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
}