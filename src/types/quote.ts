export interface Quote {
  id: number;
  from: string;
  to: string;
  amount: number;
  rate: number;
  convertedAmount: number;
  timestamp: string;
  expiresAt: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuoteRequest {
  amount: number;
  from: string;
  to: string;
}
