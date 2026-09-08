export interface TicketTier {
  id: string;
  name: string;
  price: string;
  subtitle?: string;
  ticketsAvailable?: string;
}

export interface EventDetailData {
  id: string | number;
  status: string;
  title: string;
  category: string;
  venue: string;
  state: string;
  numberAttending: string;
  startDate: string;
  startTime: string;
  ticketTiers: TicketTier[];
  image: string;
  promoCode: string;
  promoDiscount: string;
  refundPolicy: string;
  description: string;
}

export const DEFAULT_PROMO_CODE = "TIX20";
export const DEFAULT_PROMO_DISCOUNT = "20% off";
export const DEFAULT_REFUND_POLICY =
  "Full refund upto 48 hours before the event";
export const DEFAULT_DESCRIPTION =
  "This is a Description This is a DescriptionThis is a DescriptionThis is a DescriptionThis is a Description";

export function splitVenue(rawVenue: string): { venue: string; state: string } {
  const [venue, ...rest] = rawVenue.split(",");
  return {
    venue: venue.trim(),
    state: rest.join(",").trim(),
  };
}
