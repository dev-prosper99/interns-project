export type TransactionStatus = "Completed" | "Pending" | "Refunded" | "Failed";

export interface Transaction {
  id: string;
  buyer: string;
  event: string;
  tickets: number;
  amount: number;
  date: string; // ISO date string
  status: TransactionStatus;
}
