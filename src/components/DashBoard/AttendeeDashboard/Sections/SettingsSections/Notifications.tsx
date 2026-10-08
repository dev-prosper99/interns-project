import { useEffect, useState } from "react";
import { notificationsApi, type NotificationPreferences } from "@/lib/notificationsApi";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";

type PreferenceKey = Extract<keyof NotificationPreferences, string>;

interface PreferenceItem {
      key: PreferenceKey;
      title: string;
      desc: string;
}

const PREFERENCE_CONFIG: PreferenceItem[] = [
      { key: "eventReminders", title: "Event Reminders", desc: "Get notified before your upcoming events" },
      { key: "newEvents", title: "New Events", desc: "Discover new events matching your interests" },
      { key: "promotionsAndOffers", title: "Promotions & Offers", desc: "Flash sales, promo codes, and exclusive deals" },
      { key: "emailNotifications", title: "Email Notifications", desc: "Receive event tickets, receipts, and account activity via email" },
      { key: "eventUpdates", title: "Event Updates", desc: "Changes to event schedule, venue, or cancellations" },
      { key: "smsNotifications", title: "SMS Notifications", desc: "Receive urgent gate alerts and one-time codes via text" },
];

const DEFAULT_PREFERENCES: NotificationPreferences = {
      emailNotifications: true,
      smsNotifications: false,
      eventReminders: true,
      eventUpdates: true,
      promotionsAndOffers: false,
      newEvents: true,
};

export default function Notifications() {
      const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
      const [initialPreferences, setInitialPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
      const [isLoading, setIsLoading] = useState(true);
      const [isSaving, setIsSaving] = useState(false);
      const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

      useEffect(() => {
            let isMounted = true;
            async function loadPreferences() {
                  setIsLoading(true);
                  try {
                        const data = await notificationsApi.getPreferences();
                        if (isMounted && data) {
                              const merged: NotificationPreferences = { ...DEFAULT_PREFERENCES, ...data };
                              setPreferences(merged);
                              setInitialPreferences(merged);
                        }
                  } catch {
                        if (isMounted) {
                              setPreferences(DEFAULT_PREFERENCES);
                              setInitialPreferences(DEFAULT_PREFERENCES);
                        }
                  } finally {
                        if (isMounted) setIsLoading(false);
                  }
            }
            loadPreferences();
            return () => {
                  isMounted = false;
            };
      }, []);

      const handleToggle = (key: PreferenceKey) => {
            setPreferences((prev: NotificationPreferences) => ({
                  ...prev,
                  [key]: !prev[key],
            }));
      };

      const handleSave = async () => {
            setIsSaving(true);
            setFeedback(null);
            try {
                  const updated = await notificationsApi.updatePreferences(preferences);
                  const merged: NotificationPreferences = { ...preferences, ...(updated || {}) };
                  setPreferences(merged);
                  setInitialPreferences(merged);
                  setFeedback({ type: "success", message: "Notification preferences updated successfully." });
            } catch (err: unknown) {
                  setFeedback({
                        type: "error",
                        message: err instanceof Error ? err.message : "Failed to update notification preferences.",
                  });
            } finally {
                  setIsSaving(false);
            }
      };

      const isDirty = JSON.stringify(preferences) !== JSON.stringify(initialPreferences);

      return (
            <div className="w-full font-poppins">
                  <div className="flex min-h-[calc(100vh-220px)] flex-col rounded-2xl bg-neutral-1000 p-4 py-6 sm:p-8 border border-neutral-900">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-neutral-900">
                              <div>
                                    <h3 className="text-lg font-semibold text-white font-jakarta">Notification Preferences</h3>
                                    <p className="text-xs text-neutral-400 mt-1">Select how and when you would like to be notified across your devices.</p>
                              </div>
                              {isDirty && (
                                    <span className="text-xs text-orange-400 font-medium self-start sm:self-auto bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                                          Unsaved changes
                                    </span>
                              )}
                        </div>

                        {feedback && (
                              <div
                                    className={`mb-6 flex items-center gap-3 rounded-xl p-4 text-sm ${
                                          feedback.type === "success"
                                                ? "bg-green-950/30 border border-green-800/40 text-green-400"
                                                : "bg-red-950/30 border border-red-800/40 text-red-400"
                                    }`}
                              >
                                    {feedback.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                                    <p className="flex-1">{feedback.message}</p>
                              </div>
                        )}

                        {isLoading ? (
                              <div className="py-12 text-center text-sm text-neutral-500">Loading your preferences...</div>
                        ) : (
                              <div className="space-y-4">
                                    {PREFERENCE_CONFIG.map(({ key, title, desc }) => {
                                          const isEnabled = Boolean(preferences[key]);
                                          return (
                                                <div
                                                      key={key}
                                                      className="flex items-center justify-between gap-4 border-b border-neutral-900/80 py-4 last:border-0 hover:bg-neutral-900/30 px-2 rounded-xl transition-colors"
                                                >
                                                      <div className="space-y-1">
                                                            <h4 className="text-sm font-medium text-white">{title}</h4>
                                                            <p className="text-xs text-neutral-400 leading-relaxed">{desc}</p>
                                                      </div>
                                                      <button
                                                            type="button"
                                                            role="switch"
                                                            aria-checked={isEnabled}
                                                            aria-label={`${title} toggle`}
                                                            onClick={() => handleToggle(key)}
                                                            className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${
                                                                  isEnabled ? "bg-purple-600" : "bg-neutral-800"
                                                            }`}
                                                      >
                                                            <span
                                                                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                                                                        isEnabled ? "left-6" : "left-1"
                                                                  }`}
                                                            />
                                                      </button>
                                                </div>
                                          );
                                    })}
                              </div>
                        )}

                        <div className="mt-auto flex justify-end pt-8 border-t border-neutral-900">
                              <Button
                                    type="button"
                                    variant="neutral"
                                    size="lg"
                                    className="w-full sm:w-auto"
                                    onClick={handleSave}
                                    disabled={isSaving || !isDirty}
                              >
                                    {isSaving ? "Saving..." : "Save Preferences"}
                              </Button>
                        </div>
                  </div>
            </div>
      );
}
