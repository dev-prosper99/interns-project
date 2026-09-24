export interface ApiTicketPayload {
      id?: string | number;
      Id?: string | number;
      name?: string;
      Name?: string;
      description?: string;
      Description?: string;
      price?: string | number;
      Price?: string | number;
      totalQuantity?: string | number;
      TotalQuantity?: string | number;
      quantity?: string | number;
      Quantity?: string | number;
}

export interface ApiEventPayload {
      [key: string]: unknown;
      id?: string | number;
      Id?: string | number;
      title?: string;
      Title?: string;
      description?: string;
      Description?: string;
      eventDescription?: string;
      details?: string;
      venue?: string;
      Venue?: string;
      state?: string;
      State?: string;
      city?: string;
      City?: string;
      eventDate?: string;
      EventDate?: string;
      availabilityStart?: string;
      AvailabilityStart?: string;
      startDate?: string;
      StartDate?: string;
      date?: string;
      availabilityEnd?: string;
      AvailabilityEnd?: string;
      endDate?: string;
      EndDate?: string;
      startTime?: string;
      time?: string;
      eventCategory?: string;
      EventCategory?: string;
      category?: string;
      Category?: string;
      categoryOther?: string;
      CategoryOther?: string;
      customCategory?: string;
      bannerUrl?: string;
      BannerUrl?: string;
      image?: string;
      promoCode?: string;
      PromoCode?: string;
      promo_code?: string;
      discount?: string | number;
      Discount?: string | number;
      promoDiscount?: string | number;
      eventPolicy?: string;
      EventPolicy?: string;
      refundPolicy?: string;
      RefundPolicy?: string;
      customRefundNote?: string;
      CustomRefundNote?: string;
      ticketTypes?: ApiTicketPayload[];
      TicketTypes?: ApiTicketPayload[];
      tickets?: ApiTicketPayload[];
      Tickets?: ApiTicketPayload[];
      tiers?: ApiTicketPayload[];
}

export interface Tier {
      id: string;
      name: string;
      description: string;
      price: string;
      quantity: string;
}

export interface EventFormData {
      title: string;
      description: string;
      category: string;
      customCategory: string;
      startDate: string;
      endDate: string;
      startTime: string;
      venue: string;
      state: string;
      city: string;
      bannerUrl: string | null;
      bannerPreview: string;
      tiers: Tier[];
      promoCode: string;
      discount: string;
      refundPolicy: string;
      customRefundNote: string;
}

export type FormUpdater = (patch: Partial<EventFormData>) => void;

export interface StepDefinition {
      key: string;
      label: string;
      sub: string;
}

export interface RefundPolicyOption {
      key: string;
      label: string;
}

export type AlertType = "success" | "error";

export interface AlertState {
      type: AlertType;
      title: string;
      message: string;
}

export type SelectOption = string | { value: string; label: string };
