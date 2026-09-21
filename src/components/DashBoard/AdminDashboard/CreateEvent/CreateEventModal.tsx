import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Stepper from "./Stepper";
import StepBasics from "./StepBasics";
import StepTickets from "./StepTickets";
import StepSettings from "./StepSettings";
import StepReview from "./StepReview";
import { STEPS, emptyForm, CATEGORIES, emptyTier } from "../../../../constants/eventOptions";
import Alert from "@/assets/alert";
import { Button } from "@/components/ui/button";
import type { AlertState, AlertType, Tier, EventFormData, ApiEventPayload, ApiTicketPayload, SelectOption } from "./types";
import type { EventRowData } from "../../../Events/Types";

const API_URL = "https://peacemaker001-001-site1.ltempurl.com/api/Events";
const STORAGE_KEY_FORM = "create_event_form_draft";
const STORAGE_KEY_STEP = "create_event_step_index";

const getStoredToken = (): string => {
      if (typeof window === "undefined") return "";
      const directToken = window.localStorage.getItem("token");
      if (directToken) return directToken;
      const tokenKeys = ["accessToken", "authToken", "jwt", "bearerToken"];
      for (const key of tokenKeys) {
            const value = window.localStorage.getItem(key);
            if (value) return value;
      }
      return "";
};

const generateId = (): string => {
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
            return crypto.randomUUID();
      }
      return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

const parseDateToYMD = (val: unknown): string => {
      if (!val) return "";
      if (typeof val === "string") {
            if (val.includes("T")) {
                  const part = val.split("T")[0];
                  if (/^\d{4}-\d{2}-\d{2}$/.test(part)) return part;
            }
            if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
      }
      const d = new Date(val as string | number | Date);
      if (Number.isNaN(d.getTime())) return "";
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
};

const parseTimeToHM = (val: unknown): string => {
      if (!val) return "";
      if (typeof val === "string" && (val.endsWith("Z") || /[+-]\d{2}:?\d{2}$/.test(val))) {
            const d = new Date(val);
            if (!Number.isNaN(d.getTime())) {
                  const h = String(d.getHours()).padStart(2, "0");
                  const m = String(d.getMinutes()).padStart(2, "0");
                  return `${h}:${m}`;
            }
      }
      if (typeof val === "string" && val.includes("T")) {
            const timePart = val.split("T")[1];
            if (timePart) {
                  const clean = timePart.replace(/Z|[+-].*$/, "");
                  const [h, m] = clean.split(":");
                  if (h && m) return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
            }
      }
      if (typeof val === "string" && /^\d{1,2}:\d{2}/.test(val)) {
            const [h, m] = val.split(":");
            return `${h.padStart(2, "0")}:${m.substring(0, 2)}`;
      }
      const d = new Date(val as string | number | Date);
      if (!Number.isNaN(d.getTime())) {
            const h = String(d.getHours()).padStart(2, "0");
            const m = String(d.getMinutes()).padStart(2, "0");
            return `${h}:${m}`;
      }
      return "";
};

const toIsoDateTime = (date: string, time: string): string => {
      if (!date) return "";
      const timePart = time ? (time.length === 5 ? `${time}:00` : time) : "00:00:00";
      return `${date}T${timePart}`;
};

interface CreateEventModalProps {
      isOpen: boolean;
      onClose?: () => void;
      eventId?: string | number;
      initialData?: (Partial<EventRowData> & Record<string, unknown>) | null;
}

const CreateEventModal = ({ isOpen, onClose, eventId, initialData }: CreateEventModalProps) => {
      const isEditing = Boolean(eventId);

      const [form, setForm] = useState<EventFormData>(() => {
            if (typeof window === "undefined") return emptyForm;
            if (eventId) {
                  try {
                        const cached = localStorage.getItem(`event_cache_${eventId}`);
                        if (cached) {
                              return JSON.parse(cached) as EventFormData;
                        }
                  } catch {
                        console.error();
                  }

                  if (initialData) {
                        const rawDate = initialData.startDate || initialData.date;
                        const rawTime = initialData.startTime || initialData.time;
                        const rawEndDate = initialData.endDate;
                        return {
                              ...emptyForm,
                              title: initialData.title ?? "",
                              description: typeof initialData.description === "string" ? initialData.description : "",
                              venue: initialData.venue ?? "",
                              state: typeof initialData.state === "string" ? initialData.state : "",
                              city: typeof initialData.city === "string" ? initialData.city : "",
                              category: initialData.category ?? "",
                              startDate: parseDateToYMD(rawDate),
                              startTime: parseTimeToHM(rawTime),
                              endDate: parseDateToYMD(rawEndDate),
                              bannerUrl: initialData.image || (initialData.bannerUrl ? String(initialData.bannerUrl) : ""),
                              bannerPreview: initialData.image || (initialData.bannerUrl ? String(initialData.bannerUrl) : ""),
                        };
                  }
                  return emptyForm;
            }
            try {
                  const savedForm = localStorage.getItem(STORAGE_KEY_FORM);
                  return savedForm ? (JSON.parse(savedForm) as EventFormData) : emptyForm;
            } catch {
                  console.error();
                  return emptyForm;
            }
      });

      const [stepIndex, setStepIndex] = useState(() => {
            if (typeof window === "undefined" || eventId) return 0;
            try {
                  const savedStep = localStorage.getItem(STORAGE_KEY_STEP);
                  if (savedStep) {
                        const parsedStep = parseInt(savedStep, 10);
                        if (!Number.isNaN(parsedStep) && parsedStep >= 0 && parsedStep < STEPS.length) {
                              return parsedStep;
                        }
                  }
            } catch {
                  console.error();
            }
            return 0;
      });

      const [alert, setAlert] = useState<AlertState | null>(null);
      const [isSubmitting, setIsSubmitting] = useState(false);

      useEffect(() => {
            if (!isOpen || eventId) return;
            try {
                  localStorage.setItem(STORAGE_KEY_FORM, JSON.stringify(form));
                  localStorage.setItem(STORAGE_KEY_STEP, stepIndex.toString());
            } catch {
                  console.error();
            }
      }, [form, stepIndex, isOpen, eventId]);

      useEffect(() => {
            if (!eventId) return;
            let cancelled = false;

            const fetchEvent = async () => {
                  try {
                        const token = getStoredToken();
                        const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;
                        const response = await fetch(`${API_URL}/${eventId}`, {
                              method: "GET",
                              headers: {
                                    ...(cleanToken ? { Authorization: `Bearer ${cleanToken}` } : {}),
                                    Accept: "application/json",
                              },
                        });

                        let event: ApiEventPayload | null = null;
                        if (response.ok) {
                              const result = (await response.json()) as { data?: ApiEventPayload | ApiEventPayload[] } & ApiEventPayload;
                              const unwrapped = result?.data ?? result;
                              event = Array.isArray(unwrapped) ? (unwrapped[0] as ApiEventPayload) : (unwrapped as ApiEventPayload);
                        }

                        if (cancelled) return;

                        let savedMeta: ApiEventPayload | null = null;
                        try {
                              const metaStr = localStorage.getItem(`event_meta_${eventId}`);
                              if (metaStr) savedMeta = JSON.parse(metaStr) as ApiEventPayload;
                              if (!savedMeta) {
                                    const cacheStr = localStorage.getItem(`event_cache_${eventId}`);
                                    if (cacheStr) savedMeta = JSON.parse(cacheStr) as ApiEventPayload;
                              }
                        } catch {
                              console.error();
                        }

                        const source = event || savedMeta || (initialData as ApiEventPayload) || {};

                        const rawEventDate =
                              source.eventDate ||
                              source.EventDate ||
                              source.availabilityStart ||
                              source.AvailabilityStart ||
                              source.startDate ||
                              source.StartDate ||
                              source.date;
                        const startDateStr = parseDateToYMD(rawEventDate);
                        const startTimeStr = parseTimeToHM(rawEventDate) || (typeof source.startTime === "string" ? source.startTime : "");

                        const endSource = source.availabilityEnd || source.AvailabilityEnd || source.endDate || source.EndDate;
                        const endDateStr = parseDateToYMD(endSource);

                        const rawCat = (source.eventCategory || source.EventCategory || source.category || source.Category || "") as string;
                        let resolvedCategory = "";
                        let customCat = (source.categoryOther || source.CategoryOther || source.customCategory || "") as string;

                        if (rawCat) {
                              const matched = CATEGORIES.find((c: SelectOption) => {
                                    const val = typeof c === "string" ? c : (c.value ?? c.label ?? "");
                                    return String(val).toLowerCase() === String(rawCat).toLowerCase();
                              });

                              if (matched) {
                                    resolvedCategory = typeof matched === "string" ? matched : (matched.value ?? matched.label ?? "");
                              } else {
                                    resolvedCategory = "Other";
                                    customCat = rawCat;
                              }
                        }

                        let venueVal = String(source.venue ?? source.Venue ?? "");
                        let stateVal = String(source.state ?? source.State ?? "");
                        let cityVal = String(source.city ?? source.City ?? "");

                        if (!stateVal && venueVal.includes(",")) {
                              const parts = venueVal.split(",").map((s: string) => s.trim());
                              if (parts.length >= 2) {
                                    venueVal = parts[0];
                                    stateVal = parts[1];
                                    if (parts.length >= 3) cityVal = parts[2];
                              }
                        }

                        const rawTiers = (source.ticketTypes ??
                              source.TicketTypes ??
                              source.tickets ??
                              source.Tickets ??
                              source.tiers ??
                              savedMeta?.tiers ??
                              []) as ApiTicketPayload[];
                        const loadedTiers: Tier[] =
                              Array.isArray(rawTiers) && rawTiers.length > 0
                                    ? rawTiers.map((ticket: ApiTicketPayload) => ({
                                            id: String(ticket.id || ticket.Id || generateId()),
                                            name: String(ticket.name ?? ticket.Name ?? ""),
                                            description: String(ticket.description ?? ticket.Description ?? ""),
                                            price: String(ticket.price ?? ticket.Price ?? 0),
                                            quantity: String(ticket.totalQuantity ?? ticket.TotalQuantity ?? ticket.quantity ?? ticket.Quantity ?? 0),
                                      }))
                                    : [emptyTier()];

                        const promoCodeVal = String(source.promoCode || source.PromoCode || source.promo_code || savedMeta?.promoCode || "");
                        const discountVal =
                              source.discount != null
                                    ? String(source.discount)
                                    : source.Discount != null
                                      ? String(source.Discount)
                                      : source.promoDiscount != null
                                        ? String(source.promoDiscount)
                                        : savedMeta?.discount != null
                                          ? String(savedMeta.discount)
                                          : "";

                        const refundPolicyVal = String(
                              source.eventPolicy || source.EventPolicy || source.refundPolicy || source.RefundPolicy || savedMeta?.refundPolicy || "",
                        );
                        const customRefundVal = String(source.customRefundNote || source.CustomRefundNote || savedMeta?.customRefundNote || "");
                        const descriptionVal = String(
                              source.description || source.Description || source.eventDescription || source.details || savedMeta?.description || "",
                        );
                        const bannerUrlVal = String(source.bannerUrl || source.BannerUrl || source.image || "");

                        setForm((prev) => ({
                              ...prev,
                              title: String(source.title ?? source.Title ?? prev.title),
                              description: descriptionVal || prev.description,
                              category: resolvedCategory || prev.category,
                              customCategory: customCat || prev.customCategory,
                              venue: venueVal || prev.venue,
                              state: stateVal || prev.state,
                              city: cityVal || prev.city,
                              bannerUrl: bannerUrlVal || prev.bannerUrl,
                              bannerPreview: bannerUrlVal || prev.bannerPreview,
                              refundPolicy: refundPolicyVal || prev.refundPolicy,
                              customRefundNote: customRefundVal || prev.customRefundNote,
                              startDate: startDateStr || prev.startDate,
                              startTime: startTimeStr || prev.startTime,
                              endDate: endDateStr || prev.endDate,
                              promoCode: promoCodeVal,
                              discount: discountVal,
                              tiers: loadedTiers.length > 0 ? loadedTiers : prev.tiers,
                        }));
                        setStepIndex(0);
                  } catch {
                        console.error();
                  }
            };

            fetchEvent();

            return () => {
                  cancelled = true;
            };
      }, [eventId, initialData]);

      const update = (patch: Partial<EventFormData>) => setForm((f) => ({ ...f, ...patch }));

      const showAlert = (type: AlertType, title: string, message: string) => {
            setAlert({ type, title, message });
            window.setTimeout(() => setAlert(null), 4500);
      };

      const validateStep = (index: number): boolean => {
            const currentStepKey = STEPS[index]?.key;
            if (currentStepKey === "basics") {
                  if (
                        !form.title ||
                        !form.description ||
                        !form.category ||
                        !form.startDate ||
                        !form.startTime ||
                        !form.venue ||
                        !form.state ||
                        !form.city ||
                        !form.bannerUrl
                  ) {
                        showAlert("error", "Missing Details", "Please fill in all required fields in Event Details before proceeding.");
                        return false;
                  }
                  if (form.category === "Other" && !form.customCategory) {
                        showAlert("error", "Missing Details", "Please enter your custom category before proceeding.");
                        return false;
                  }
            } else if (currentStepKey === "tickets") {
                  if (!form.tiers || form.tiers.length === 0) {
                        showAlert("error", "Missing Details", "Please add at least one ticket tier.");
                        return false;
                  }
                  for (const tier of form.tiers) {
                        if (!tier.name || tier.price === "" || tier.quantity === "") {
                              showAlert("error", "Missing Details", "Please fill in the name, price, and quantity for all ticket tiers.");
                              return false;
                        }
                  }
            } else if (currentStepKey === "settings") {
                  if (!form.refundPolicy) {
                        showAlert("error", "Missing Details", "Please select a refund policy before proceeding.");
                        return false;
                  }
                  if (form.refundPolicy === "custom" && !form.customRefundNote) {
                        showAlert("error", "Missing Details", "Please describe your custom refund policy.");
                        return false;
                  }
            }
            return true;
      };

      const goNext = () => {
            if (validateStep(stepIndex)) {
                  setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
            }
      };

      const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

      const clearDraft = () => {
            try {
                  localStorage.removeItem(STORAGE_KEY_FORM);
                  localStorage.removeItem(STORAGE_KEY_STEP);
            } catch {
                  console.error();
            }
      };

      const handleReset = () => {
            setStepIndex(0);
            setForm(emptyForm);
            clearDraft();
      };

      const handlePublish = async () => {
            if (!form.title || !form.description || !form.venue || !form.state || !form.city || !form.startDate || !form.startTime) {
                  showAlert("error", "Missing details", "Fill the required event fields before publishing.");
                  return;
            }

            const formattedCategory = form.category ? form.category.toLowerCase() : "";

            const payload = {
                  title: form.title,
                  description: form.description,
                  venue: form.venue,
                  state: form.state,
                  city: form.city,
                  eventDate: toIsoDateTime(form.startDate, form.startTime),
                  bannerUrl: form.bannerUrl || "",
                  eventPolicy: form.refundPolicy,
                  availabilityStart: toIsoDateTime(form.startDate, form.startTime),
                  availabilityEnd: toIsoDateTime(form.endDate || form.startDate, form.startTime),
                  promoCode: form.promoCode || null,
                  discount: Number(form.discount) || 0,
                  ticketTypes: form.tiers.map((tier: Tier) => ({
                        name: tier.name,
                        description: tier.description,
                        price: Number(tier.price) || 0,
                        totalQuantity: Number(tier.quantity) || 0,
                  })),
                  category: formattedCategory,
                  categoryOther: formattedCategory === "other" ? form.customCategory || "" : "",
            };

            try {
                  setIsSubmitting(true);
                  const token = getStoredToken();
                  const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;
                  const url = isEditing ? `${API_URL}/${eventId}` : API_URL;
                  const method = isEditing ? "PUT" : "POST";

                  const response = await fetch(url, {
                        method,
                        headers: {
                              "Content-Type": "application/json",
                              ...(cleanToken ? { Authorization: `Bearer ${cleanToken}` } : {}),
                        },
                        body: JSON.stringify(payload),
                  });

                  const responseText = await response.text();
                  const responseBody = responseText ? (JSON.parse(responseText) as Record<string, unknown>) : null;

                  if (!response.ok) {
                        const message = (responseBody?.message as string) || (responseBody?.error as string) || `Request failed with status ${response.status}`;
                        throw new Error(message);
                  }

                  const dataObj = responseBody?.data as Record<string, unknown> | undefined;
                  const savedEventId = isEditing
                        ? eventId
                        : ((dataObj?.id as string | number | undefined) ??
                          (responseBody?.id as string | number | undefined) ??
                          (responseBody?.data as string | number | undefined));

                  if (savedEventId) {
                        try {
                              const meta = {
                                    promoCode: form.promoCode,
                                    discount: form.discount,
                                    refundPolicy: form.refundPolicy,
                                    customRefundNote: form.customRefundNote,
                                    tiers: form.tiers,
                              };
                              localStorage.setItem(`event_meta_${savedEventId}`, JSON.stringify(meta));
                              localStorage.setItem(`event_cache_${savedEventId}`, JSON.stringify({ ...form, id: savedEventId }));
                        } catch {
                              console.error();
                        }
                  }

                  showAlert(
                        "success",
                        isEditing ? "Event updated" : "Event published",
                        (responseBody?.message as string) || (isEditing ? "Your event was updated successfully." : "Your event was created successfully."),
                  );

                  clearDraft();
                  handleReset();
                  onClose?.();
            } catch (err: unknown) {
                  showAlert(
                        "error",
                        isEditing ? "Update failed" : "Publish failed",
                        err instanceof Error ? err.message : `Unable to ${isEditing ? "update" : "create"} the event.`,
                  );
            } finally {
                  setIsSubmitting(false);
            }
      };

      const renderStep = () => {
            switch (STEPS[stepIndex].key) {
                  case "basics":
                        return <StepBasics form={form} update={update} />;
                  case "tickets":
                        return <StepTickets form={form} update={update} />;
                  case "settings":
                        return <StepSettings form={form} update={update} />;
                  case "review":
                        return <StepReview form={form} />;
                  default:
                        return null;
            }
      };

      if (!isOpen) return null;

      return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6" onClick={onClose}>
                  {alert && (
                        <div className="fixed top-6 right-6 z-50 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                              <Alert type={alert.type} title={alert.title} message={alert.message} onClose={() => setAlert(null)} />
                        </div>
                  )}

                  <div className="w-full max-w-3xl bg-neutral-1000 rounded-2xl border border-neutral-800 shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-5">
                              <div>
                                    <h2 className="text-lg font-semibold text-neutral-100">{isEditing ? "Edit Event" : "Create New Event"}</h2>
                                    <p className="text-sm text-neutral-500">Follow the steps to publish your event</p>
                              </div>
                              <Button
                                    type="button"
                                    variant="inactive"
                                    onClick={onClose}
                                    className="h-9 w-9 rounded-full p-0 text-neutral-500 hover:text-neutral-300"
                                    aria-label="Close"
                              >
                                    <X size={18} />
                              </Button>
                        </div>

                        <Stepper currentIndex={stepIndex} />

                        <div className="max-h-[55vh] overflow-y-auto pr-1 -mr-1">{renderStep()}</div>

                        <div className="flex gap-3 mt-7">
                              <Button
                                    onClick={goBack}
                                    disabled={stepIndex === 0}
                                    variant="secondary"
                                    className="flex-1 h-11 disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                    Back
                              </Button>
                              {stepIndex < STEPS.length - 1 ? (
                                    <Button onClick={goNext} variant="yellow" className="flex-1 h-11">
                                          Continue
                                    </Button>
                              ) : (
                                    <Button
                                          onClick={handlePublish}
                                          disabled={isSubmitting}
                                          variant="yellow"
                                          className="flex-1 h-11 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                          {isSubmitting ? "Publishing..." : isEditing ? "Save Changes" : "Publish Event"}
                                    </Button>
                              )}
                        </div>
                  </div>
            </div>
      );
};

export default CreateEventModal;
