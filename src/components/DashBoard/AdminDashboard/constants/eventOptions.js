const statesByCity = {
  Lagos: ["Ikeja", "Surulere", "Lekki", "Victoria Island", "Yaba"],
  Abuja: ["Garki", "Maitama", "Wuse", "Asokoro", "Gwarinpa"],
  Rivers: ["Port Harcourt", "Obio-Akpor", "Eleme", "Oyigbo"],
  Oyo: ["Ibadan North", "Ibadan South-West", "Akinyele", "Egbeda"],
};

export const CATEGORIES = [
  { label: "Music", value: "Music" },
  { label: "Tech", value: "Tech" },
  { label: "Business", value: "Business" },
  { label: "Sports", value: "Sports" },
  { label: "Art", value: "Art" },
];

export const STATES = Object.keys(statesByCity).map((state) => ({
  label: state,
  value: state,
}));

export const CITIES = Object.fromEntries(
  Object.entries(statesByCity).map(([state, cities]) => [
    state,
    cities.map((city) => ({ label: city, value: city })),
  ]),
);

export const REFUND_POLICIES = [
  {
    key: "no-refund",
    label: "No refunds",
  },
  {
    key: "partial",
    label: "Partial refunds",
  },
  {
    key: "full",
    label: "Full refunds",
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

export const emptyForm = {
  title: "",
  description: "",
  category: "",
  startDate: "",
  endDate: "",
  startTime: "",
  venue: "",
  state: "",
  city: "",
  bannerImage: null,
  bannerPreview: "",
  tiers: [emptyTier()],
  promoCode: "",
  discount: "",
  refundPolicy: "no-refund",
  customRefundNote: "",
};