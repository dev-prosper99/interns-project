import { useState } from "react";

const notifications = [
      { title: "Event Reminder", desc: "Get notified before your upcoming events" },
      { title: "News Events", desc: "Discover new events matching your interests" },
      { title: "Promotions & Offers", desc: "Flash sales, promo codes, and exclusive deals" },
      { title: "Email Notifications", desc: "Receive email notifications" },
      { title: "Event Updates", desc: "Changes to events you've purchased tickets for" },
      { title: "SMS Notifications", desc: "Receive important updates via text message" },
];

export default function Notifications() {
      const [enabledNotifications, setEnabledNotifications] = useState<boolean[]>(notifications.map((_, index) => index % 2 === 0));

      const toggleNotification = (index: number) => {
            setEnabledNotifications((current) => current.map((item, itemIndex) => (itemIndex === index ? !item : item)));
      };

      return (
            <div className="w-full font-poppins">
                  <div className="flex min-h-[calc(100vh-220px)] flex-col rounded-2xl bg-neutral-1000 p-4 py-6 sm:p-6">
                        <h3 className="mb-4 text-lg font-medium text-white">Notification Preferences</h3>

                        <div className="space-y-4">
                              {notifications.map((notification, index) => {
                                    const isEnabled = enabledNotifications[index];

                                    return (
                                          <div key={index} className="flex items-center justify-between gap-3 border-b border-neutral-900 py-3 last:border-0">
                                                <div className="space-y-1">
                                                      <h3 className="text-sm font-medium text-white">{notification.title}</h3>
                                                      <p className="text-xs text-neutral-300">{notification.desc}</p>
                                                </div>

                                                <button
                                                      type="button"
                                                      aria-label={`${notification.title} toggle`}
                                                      onClick={() => toggleNotification(index)}
                                                      className={`relative h-6 w-11 rounded-full transition-colors ${
                                                            isEnabled ? "bg-purple-600" : "bg-neutral-700"
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
                  </div>
            </div>
      );
}
