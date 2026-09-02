export type TicketTier = "VIP" | "VVIP" | "Free" | "Regular";
export type Status = "Confirmed" | "Pending" | "Cancelled" | "Checked-in";
 
export interface Attendee {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  event: string;
  ticketTier: TicketTier;
  tickets: number;
  ticketNo: string;
  amountPaid: number | "Free";
  purchaseDate: string;
  guestCode: string;
  status: Status;
  phone: string;
}
 
export const TIER_SUBTITLE: Record<TicketTier, string> = {
  VIP: "Best Experience",
  VVIP: "Special Reservation",
  Free: "Limited Benefit",
  Regular: "Regular sitting area",
};
 
export const ATTENDEES: Attendee[] = [
  {
    id: "1",
    name: "Amara Okafor",
    email: "amaraokafor@gmail.com",
    avatarColor: "bg-purple-500",
    event: "TechFest West Africa",
    ticketTier: "VIP",
    tickets: 2,
    ticketNo: "TXF-2109-1481",
    amountPaid: 27000,
    purchaseDate: "14-05-2026",
    guestCode: "28-07-2026",
    status: "Confirmed",
    phone: "+234 803 234 5678",
  },
  {
    id: "2",
    name: "Emeka Nwosu",
    email: "emekanwosu@yahoo.com",
    avatarColor: "bg-purple-500",
    event: "Lagos Comedy Fiesta",
    ticketTier: "VVIP",
    tickets: 1,
    ticketNo: "LCF-4402-7712",
    amountPaid: 45000,
    purchaseDate: "14-05-2026",
    guestCode: "28-07-2026",
    status: "Checked-in",
    phone: "+234 802 111 2233",
  },
  {
    id: "3",
    name: "Fatima Abdullahi",
    email: "fatimaabdullahi@gmail.com",
    avatarColor: "bg-purple-500",
    event: "Lagos Fashion Week",
    ticketTier: "Free",
    tickets: 3,
    ticketNo: "LFW-0093-5541",
    amountPaid: "Free",
    purchaseDate: "14-05-2026",
    guestCode: "28-07-2026",
    status: "Confirmed",
    phone: "+234 809 555 7890",
  },
  {
    id: "4",
    name: "Chukwudi Eze",
    email: "chukwudieze@gmail.com",
    avatarColor: "bg-purple-500",
    event: "Wellness Weekend",
    ticketTier: "Regular",
    tickets: 1,
    ticketNo: "WLW-7723-3390",
    amountPaid: 27000,
    purchaseDate: "14-05-2026",
    guestCode: "28-07-2026",
    status: "Cancelled",
    phone: "+234 701 222 4455",
  },
  {
    id: "5",
    name: "Tunde Balogun",
    email: "tundebalogun@gmail.com",
    avatarColor: "bg-purple-500",
    event: "Startup Summit",
    ticketTier: "VIP",
    tickets: 1,
    ticketNo: "SUS-1298-6604",
    amountPaid: 27000,
    purchaseDate: "14-05-2026",
    guestCode: "28-07-2026",
    status: "Confirmed",
    phone: "+234 805 333 1122",
  },
  {
    id: "6",
    name: "Emmanuel Danladi",
    email: "emmanueldanladi@gmail.com",
    avatarColor: "bg-purple-500",
    event: "Afro Art Exhibition",
    ticketTier: "VIP",
    tickets: 1,
    ticketNo: "AAE-5567-2201",
    amountPaid: 27000,
    purchaseDate: "14-05-2026",
    guestCode: "28-07-2026",
    status: "Confirmed",
    phone: "+234 806 444 9988",
  },
  {
    id: "7",
    name: "Aisha Ibrahim",
    email: "aishaibrahim@gmail.com",
    avatarColor: "bg-purple-500",
    event: "AFCON Watch Party",
    ticketTier: "Free",
    tickets: 1,
    ticketNo: "AWP-9021-4471",
    amountPaid: "Free",
    purchaseDate: "14-05-2026",
    guestCode: "28-07-2026",
    status: "Confirmed",
    phone: "+234 812 777 6655",
  },
  {
    id: "8",
    name: "Bolu Adeyemi",
    email: "boluadeyemi@gmail.com",
    avatarColor: "bg-purple-500",
    event: "Art Exhibition",
    ticketTier: "VIP",
    tickets: 1,
    ticketNo: "ARX-3345-8820",
    amountPaid: 27000,
    purchaseDate: "14-05-2026",
    guestCode: "28-07-2026",
    status: "Confirmed",
    phone: "+234 813 888 3344",
  },
  {
    id: "9",
    name: "Michael Iselinde",
    email: "michaeliselinde@gmail.com",
    avatarColor: "bg-purple-500",
    event: "DJ Fresh Workshop",
    ticketTier: "VIP",
    tickets: 1,
    ticketNo: "DFW-6612-9903",
    amountPaid: 27000,
    purchaseDate: "14-05-2026",
    guestCode: "28-07-2026",
    status: "Confirmed",
    phone: "+234 814 999 2211",
  },
  {
    id: "10",
    name: "James Tubi",
    email: "jamestubi@gmail.com",
    avatarColor: "bg-purple-500",
    event: "Fitness Journey",
    ticketTier: "VIP",
    tickets: 1,
    ticketNo: "FIT-2287-1103",
    amountPaid: 27000,
    purchaseDate: "14-05-2026",
    guestCode: "28-07-2026",
    status: "Confirmed",
    phone: "+234 815 000 5566",
  },
];
 