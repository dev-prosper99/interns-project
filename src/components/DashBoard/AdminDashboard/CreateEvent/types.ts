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
