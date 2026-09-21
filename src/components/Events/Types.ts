export interface EventRowData {
      id: string | number;
      title: string;
      venue: string;
      date: string;
      time: string;
      category: string;
      image: string;
      bannerUrl?: string | null;
      revenue: string;
      status: string;
}

export interface RawApiTicket {
      id?: string | number;
      Id?: string | number;
      name?: string;
      Name?: string;
      price?: string | number;
      Price?: string | number;
      totalQuantity?: string | number;
      TotalQuantity?: string | number;
      quantity?: string | number;
      Quantity?: string | number;
      description?: string;
      Description?: string;
}

export interface RawApiEvent {
      id?: string | number;
      Id?: string | number;
      title?: string;
      Title?: string;
      venue?: string;
      Venue?: string;
      city?: string;
      City?: string;
      state?: string;
      State?: string;
      eventDate?: string;
      EventDate?: string;
      availabilityStart?: string;
      eventCategory?: string;
      EventCategory?: string;
      category?: string;
      Category?: string;
      bannerUrl?: string;
      BannerUrl?: string;
      image?: string;
      status?: string;
      Status?: string;
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
      description?: string;
      Description?: string;
      numberAttending?: string | number;
      NumberAttending?: string | number;
      ticketTypes?: RawApiTicket[];
      TicketTypes?: RawApiTicket[];
      [key: string]: unknown;
}
