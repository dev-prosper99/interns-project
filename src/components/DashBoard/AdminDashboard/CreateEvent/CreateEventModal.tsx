import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Stepper from "./Stepper";
import StepBasics from "./StepBasics";
import StepTickets from "./StepTickets";
import StepSettings from "./StepSettings";
import StepReview from "./StepReview";
import { STEPS, emptyForm } from "../../../../constants/eventOptions";
import Alert from "@/assets/alert";
import { Button } from "@/components/ui/button";
import type { AlertState, AlertType, Tier, EventFormData } from "./types";

const API_URL = "https://peacemaker001-001-site1.ltempurl.com/api/Events";
const STORAGE_KEY_FORM = "create_event_form_draft";
const STORAGE_KEY_STEP = "create_event_step_index";

const getStoredToken = (): string => {
      if (typeof window === "undefined") return "";
      const tokenKeys = ["token", "accessToken", "authToken", "jwt", "bearerToken"];
      for (const key of tokenKeys) {
            const value = window.localStorage.getItem(key);
            if (value) return value;
      }
      return "";
};

const toIsoDateTime = (date: string, time: string): string => {
      if (!date) return "";
      const timePart = time || "00:00";
      const parsed = new Date(`${date}T${timePart}`);
      return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString();
};

interface CreateEventModalProps {
      isOpen: boolean;
      onClose?: () => void;
      eventId?: string | number;
}

const CreateEventModal = ({ isOpen, onClose, eventId }: CreateEventModalProps) => {
      const [form, setForm] = useState<EventFormData>(() => {
            if (typeof window === "undefined" || eventId) return emptyForm;
            try {
                  const savedForm = localStorage.getItem(STORAGE_KEY_FORM);
                  return savedForm ? JSON.parse(savedForm) : emptyForm;
            } catch (error) {
                  console.error("Failed to load draft from localStorage:", error);
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
            } catch (error) {
                  console.error("Failed to load step index from localStorage:", error);
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
            } catch (error) {
                  console.error("Failed to save draft to localStorage:", error);
            }
      }, [form, stepIndex, isOpen, eventId]);

      useEffect(() => {
            if (!eventId) return;
            const fetchEvent = async () => {
                  try {
                        const token = getStoredToken();
                        const response = await fetch(`https://peacemaker001-001-site1.ltempurl.com/api/Events/${eventId}`, {
                              headers: {
                                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                              },
                        });
                        const result = await response.json();
                        const event = result.data;
                        const startDate = new Date(event.eventDate);
                        const endDate = event.availabilityEnd ? new Date(event.availabilityEnd) : null;
                        setForm((prev: typeof emptyForm) => ({
                              ...prev,
                              title: event.title ?? "",
                              description: event.description ?? "",
                              category: event.eventCategory ?? "",
                              venue: event.venue ?? "",
                              state: event.state ?? "",
                              city: event.city ?? "",
                              bannerUrl: event.bannerUrl ?? "",
                              refundPolicy: event.eventPolicy ?? "",
                              startDate: startDate.toISOString().split("T")[0],
                              startTime: startDate.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                              }),
                              endDate: endDate ? endDate.toISOString().split("T")[0] : "",
                              tiers:
                                    event.ticketTypes?.map((ticket: any) => ({
                                          id: crypto.randomUUID(),
                                          name: ticket.name,
                                          description: ticket.description ?? "",
                                          price: String(ticket.price),
                                          quantity: String(ticket.totalQuantity),
                                    })) ?? [],
                        }));
                  } catch (error) {
                        console.error("Failed to fetch event:", error);
                  }
            };
            fetchEvent();
      }, [eventId]);

      const update = (patch: Partial<typeof emptyForm>) => setForm((f: typeof emptyForm) => ({ ...f, ...patch }));

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
            } catch (error) {
                  console.error("Failed to clear draft from localStorage:", error);
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

            const isEditing = Boolean(eventId);
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
                  const url = isEditing ? `${API_URL}/${eventId}` : API_URL;
                  const method = isEditing ? "PUT" : "POST";

                  const response = await fetch(url, {
                        method,
                        headers: {
                              "Content-Type": "application/json",
                              ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        },
                        body: JSON.stringify(payload),
                  });

                  const responseText = await response.text();
                  const responseBody = responseText ? JSON.parse(responseText) : null;

                  if (!response.ok) {
                        const message = responseBody?.message || responseBody?.error || `Request failed with status ${response.status}`;
                        throw new Error(message);
                  }

                  const savedEventId = isEditing ? eventId : responseBody?.data?.id;

                  if (savedEventId) {
                        await fetch(`https://peacemaker001-001-site1.ltempurl.com/api/TicketTypes/${savedEventId}`, {
                              method: "POST",
                              headers: {
                                    "Content-Type": "application/json",
                                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                              },
                              body: JSON.stringify(
                                    form.tiers.map((tier: Tier) => ({
                                          name: tier.name,
                                          description: tier.description,
                                          price: Number(tier.price) || 0,
                                          totalQuantity: Number(tier.quantity) || 0,
                                    })),
                              ),
                        });
                  }

                  showAlert(
                        "success",
                        isEditing ? "Event updated" : "Event published",
                        responseBody?.message || (isEditing ? "Your event was updated successfully." : "Your event was created successfully."),
                  );

                  clearDraft();
                  handleReset();
                  onClose?.();
            } catch (error) {
                  showAlert(
                        "error",
                        isEditing ? "Update failed" : "Publish failed",
                        error instanceof Error ? error.message : `Unable to ${isEditing ? "update" : "create"} the event.`,
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
                                    <h2 className="text-lg font-semibold text-neutral-100">Create New Event</h2>
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
                                          {isSubmitting ? "Publishing..." : "Publish Event"}
                                    </Button>
                              )}
                        </div>
                  </div>
            </div>
      );
};

export default CreateEventModal;
