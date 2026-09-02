export type TicketStatus = "Confirmed" | "Sold Out" | "Low Stock";

export interface TicketTier {
  id: string;
  ticketTier: string;
  tierSubtitle: string; // e.g. "Best Experience", "Special Reservation"
  event: string;
  price: number; // NGN
  isFree: boolean;
  total: number;
  sold: number;
  status: TicketStatus;
  description: string;
}
