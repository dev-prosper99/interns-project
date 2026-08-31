import type { EventFormData } from "../components/DashBoard/AdminDashboard/CreateEvent/types";

export const CATEGORIES = [
  { label: "Music", value: "Music" },
  { label: "Tech", value: "Tech" },
  { label: "Business", value: "Business" },
  { label: "Sports", value: "Sports" },
  { label: "Art", value: "Art" },
];


export const REFUND_POLICIES = [
  {
    key: "full-refund",
    label: "Full refund up to 48 hours before the event",
  },
  {
    key: "partial",
    label: "Full refund up to 7 days before the event",
  },
  {
    key: "full",
    label: "No refunds (all sales final)",
  },
  {
    key: "custom",
    label: "Custom policy",
  },
];

export const STEPS = [
  {
    key: "basics",
    label: "Event Basics",
    sub: "Name, Description, date & Venue",
  },
  {
    key: "tickets",
    label: "Ticket Types",
    sub: "Set pricing and availability",
  },
  {
    key: "settings",
    label: "Settings",
    sub: "Promo code and policies",
  },
  {
    key: "review",
    label: "Review and Publish",
    sub: "Preview and go live",
  },
];

export const emptyTier = () => ({
  id: crypto.randomUUID(),
  name: "",
  price: "",
  quantity: "",
  description: "",
});

export const emptyForm: EventFormData = {
  title: "",
  description: "",
  category: "",
  startDate: "",
  endDate: "",
  startTime: "",
  venue: "",
  state: "",
  city: "",
  bannerUrl: null,
  bannerPreview: "",
  tiers: [emptyTier()],
  promoCode: "",
  discount: "",
  refundPolicy: "no-refund",
  customRefundNote: "",
};
