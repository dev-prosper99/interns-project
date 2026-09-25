import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Check, Trash2, Mail, X, RefreshCw, Clock, AlertCircle } from "lucide-react";
import { notificationsApi, type AppNotification } from "@/lib/notificationsApi";
import { Button } from "@/components/ui/button";

interface NotificationBellDropdownProps {
      onNotificationSelect?: (notification: AppNotification) => void;
}

export default function NotificationBellDropdown({ onNotificationSelect }: NotificationBellDropdownProps) {
      const [isOpen, setIsOpen] = useState(false);
      const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
      const [notifications, setNotifications] = useState<AppNotification[]>([]);
      const [unreadCount, setUnreadCount] = useState<number>(0);
      const [isLoading, setIsLoading] = useState(false);
      const [hasError, setHasError] = useState(false);
      const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);
      const dropdownRef = useRef<HTMLDivElement>(null);

      const loadNotifications = useCallback(async () => {
            setIsLoading(true);
            setHasError(false);
            try {
                  const data: AppNotification[] = await notificationsApi.getNotifications();
                  const items = Array.isArray(data) ? data : [];
                  setNotifications(items);
                  const computedUnread = items.filter((n: AppNotification) => !n.isRead).length;
                  setUnreadCount(computedUnread);
            } catch {
                  console.error();
                  setNotifications([]);
                  setHasError(true);
            } finally {
                  setIsLoading(false);
            }
      }, []);

      useEffect(() => {
            let isMounted = true;

            const syncUnreadCount = async () => {
                  try {
                        const result: number | { count: number } = await notificationsApi.getUnreadCount();
                        if (!isMounted) return;
                        const count = typeof result === "number" ? result : (result?.count ?? 0);
                        setUnreadCount(count);
                  } catch {
                        console.error();
                        if (isMounted) {
                              setUnreadCount(0);
                        }
                  }
            };

            const initialTimer = window.setTimeout(() => {
                  void syncUnreadCount();
            }, 0);

            const interval = window.setInterval(() => {
                  void syncUnreadCount();
            }, 45000);

            return () => {
                  isMounted = false;
                  window.clearTimeout(initialTimer);
                  window.clearInterval(interval);
            };
      }, []);

      useEffect(() => {
            const handleOutsideClick = (e: MouseEvent) => {
                  if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                        setIsOpen(false);
                  }
            };
            if (isOpen) {
                  document.addEventListener("mousedown", handleOutsideClick);
            }
            return () => {
                  document.removeEventListener("mousedown", handleOutsideClick);
            };
      }, [isOpen]);

      const handleToggleDropdown = () => {
            if (!isOpen) {
                  void loadNotifications();
            }
            setIsOpen((prev) => !prev);
      };

      const handleToggleRead = async (e: React.MouseEvent, item: AppNotification) => {
            e.stopPropagation();
            try {
                  if (item.isRead) {
                        await notificationsApi.markAsUnread(item.id);
                        setNotifications((prev) => prev.map((n: AppNotification) => (n.id === item.id ? { ...n, isRead: false } : n)));
                        setUnreadCount((c: number) => c + 1);
                  } else {
                        await notificationsApi.markAsRead(item.id);
                        setNotifications((prev) => prev.map((n: AppNotification) => (n.id === item.id ? { ...n, isRead: true } : n)));
                        setUnreadCount((c: number) => Math.max(0, c - 1));
                  }
            } catch {
                  console.error();
            }
      };

      const handleMarkAllRead = async () => {
            try {
                  await notificationsApi.markAllAsRead();
                  setNotifications((prev) => prev.map((n: AppNotification) => ({ ...n, isRead: true })));
                  setUnreadCount(0);
            } catch {
                  console.error();
            }
      };

      const handleDeleteOne = async (e: React.MouseEvent, id: string) => {
            e.stopPropagation();
            try {
                  await notificationsApi.deleteNotification(id);
                  const target = notifications.find((n: AppNotification) => n.id === id);
                  setNotifications((prev) => prev.filter((n: AppNotification) => n.id !== id));
                  if (target && !target.isRead) {
                        setUnreadCount((c: number) => Math.max(0, c - 1));
                  }
                  if (selectedNotification?.id === id) {
                        setSelectedNotification(null);
                  }
            } catch {
                  console.error();
            }
      };

      const handleClearAll = async () => {
            try {
                  await notificationsApi.clearAllNotifications();
                  setNotifications([]);
                  setUnreadCount(0);
            } catch {
                  console.error();
            }
      };

      const handleItemClick = async (item: AppNotification) => {
            if (!item.isRead) {
                  try {
                        await notificationsApi.markAsRead(item.id);
                        setNotifications((prev) => prev.map((n: AppNotification) => (n.id === item.id ? { ...n, isRead: true } : n)));
                        setUnreadCount((c: number) => Math.max(0, c - 1));
                  } catch {
                        console.error();
                  }
            }
            setSelectedNotification(item);
            onNotificationSelect?.(item);
      };

      const filteredNotifications = notifications.filter((item: AppNotification) => (activeTab === "all" ? true : !item.isRead));

      const formatNotificationTime = (iso: string) => {
            const d = new Date(iso);
            if (Number.isNaN(d.getTime())) return "Recently";
            return d.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
            });
      };

      return (
            <div className="relative" ref={dropdownRef}>
                  <button
                        type="button"
                        onClick={handleToggleDropdown}
                        aria-label="Open notifications"
                        className="relative flex items-center justify-center p-2.5 rounded-xl hover:border-neutral-700 hover:bg-neutral-800 transition-all text-neutral-300 hover:text-white"
                  >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-[11px] font-bold text-white shadow-md animate-pulse">
                                    {unreadCount > 99 ? "99+" : unreadCount}
                              </span>
                        )}
                  </button>

                  {isOpen && (
                        <div className="absolute right-0 mt-3 w-[min(calc(100vw-2rem),24rem)] sm:w-96 rounded-2xl border border-neutral-800 bg-neutral-1000 shadow-2xl z-50 overflow-hidden font-poppins flex flex-col max-h-[85vh]">
                              <div className="p-4 border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md">
                                    <div className="flex items-center justify-between mb-3">
                                          <div className="flex items-center gap-2">
                                                <h3 className="text-base font-semibold text-white font-jakarta">Notifications</h3>
                                                {unreadCount > 0 && (
                                                      <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-medium text-purple-300">
                                                            {unreadCount} new
                                                      </span>
                                                )}
                                          </div>
                                          <div className="flex items-center gap-1">
                                                <button
                                                      type="button"
                                                      onClick={() => void loadNotifications()}
                                                      title="Refresh notifications"
                                                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                                                >
                                                      <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-purple-400" : ""}`} />
                                                </button>
                                                <button
                                                      type="button"
                                                      onClick={() => setIsOpen(false)}
                                                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors sm:hidden"
                                                >
                                                      <X className="w-4 h-4" />
                                                </button>
                                          </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-2">
                                          <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
                                                <button
                                                      type="button"
                                                      onClick={() => setActiveTab("all")}
                                                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                                            activeTab === "all" ? "bg-purple-600 text-white" : "text-neutral-400 hover:text-white"
                                                      }`}
                                                >
                                                      All ({notifications.length})
                                                </button>
                                                <button
                                                      type="button"
                                                      onClick={() => setActiveTab("unread")}
                                                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                                            activeTab === "unread" ? "bg-purple-600 text-white" : "text-neutral-400 hover:text-white"
                                                      }`}
                                                >
                                                      Unread ({unreadCount})
                                                </button>
                                          </div>

                                          <div className="flex items-center gap-2">
                                                {unreadCount > 0 && (
                                                      <button
                                                            type="button"
                                                            onClick={handleMarkAllRead}
                                                            className="text-[11px] text-purple-400 hover:text-purple-300 font-medium transition-colors"
                                                      >
                                                            Mark all read
                                                      </button>
                                                )}
                                                {notifications.length > 0 && (
                                                      <button
                                                            type="button"
                                                            onClick={handleClearAll}
                                                            className="text-[11px] text-neutral-400 hover:text-red-400 font-medium transition-colors"
                                                      >
                                                            Clear all
                                                      </button>
                                                )}
                                          </div>
                                    </div>
                              </div>

                              <div className="overflow-y-auto divide-y divide-neutral-900 flex-1">
                                    {isLoading ? (
                                          <div className="p-8 text-center text-sm text-neutral-500">Loading notifications...</div>
                                    ) : hasError ? (
                                          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                                <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3 text-red-400">
                                                      <AlertCircle className="w-5 h-5" />
                                                </div>
                                                <p className="text-sm font-medium text-neutral-200">Unable to load notifications</p>
                                                <p className="text-xs text-neutral-400 mt-1 max-w-xs">Server connection was interrupted. Please retry.</p>
                                                <Button variant="neutral" size="sm" className="mt-4" onClick={() => void loadNotifications()}>
                                                      Retry
                                                </Button>
                                          </div>
                                    ) : filteredNotifications.length === 0 ? (
                                          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                                <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-3 text-neutral-500">
                                                      <Bell className="w-5 h-5" />
                                                </div>
                                                <p className="text-sm font-medium text-neutral-300">No notifications found</p>
                                                <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                                                      {activeTab === "unread" ? "You have read all your notifications." : "You're completely caught up."}
                                                </p>
                                          </div>
                                    ) : (
                                          filteredNotifications.map((item: AppNotification) => (
                                                <div
                                                      key={item.id}
                                                      onClick={() => handleItemClick(item)}
                                                      className={`group relative flex items-start gap-3 p-4 transition-colors cursor-pointer ${
                                                            item.isRead ? "bg-transparent hover:bg-neutral-900/60" : "bg-purple-950/20 hover:bg-purple-950/30"
                                                      }`}
                                                >
                                                      <div
                                                            className={`mt-1 h-2 w-2 rounded-full shrink-0 ${item.isRead ? "bg-transparent" : "bg-orange-500"}`}
                                                      />

                                                      <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                                  <p
                                                                        className={`text-xs font-semibold truncate ${item.isRead ? "text-neutral-200" : "text-white font-bold"}`}
                                                                  >
                                                                        {item.title}
                                                                  </p>
                                                                  <span className="text-[10px] text-neutral-500 shrink-0 flex items-center gap-1">
                                                                        <Clock className="w-2.5 h-2.5" />
                                                                        {formatNotificationTime(item.createdAt)}
                                                                  </span>
                                                            </div>
                                                            <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{item.message}</p>
                                                      </div>

                                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                  type="button"
                                                                  title={item.isRead ? "Mark as unread" : "Mark as read"}
                                                                  onClick={(e) => handleToggleRead(e, item)}
                                                                  className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                                                            >
                                                                  {item.isRead ? (
                                                                        <Mail className="w-3.5 h-3.5" />
                                                                  ) : (
                                                                        <Check className="w-3.5 h-3.5 text-purple-400" />
                                                                  )}
                                                            </button>
                                                            <button
                                                                  type="button"
                                                                  title="Delete"
                                                                  onClick={(e) => handleDeleteOne(e, item.id)}
                                                                  className="p-1 rounded-md text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                                                            >
                                                                  <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                      </div>
                                                </div>
                                          ))
                                    )}
                              </div>
                        </div>
                  )}

                  {selectedNotification && (
                        <div
                              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 font-poppins"
                              onClick={() => setSelectedNotification(null)}
                        >
                              <div
                                    className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-1000 p-6 shadow-2xl"
                                    onClick={(e) => e.stopPropagation()}
                              >
                                    <div className="flex items-start justify-between mb-4 border-b border-neutral-800 pb-3">
                                          <div>
                                                <h3 className="text-lg font-semibold text-white font-jakarta">{selectedNotification.title}</h3>
                                                <p className="text-xs text-neutral-500 mt-0.5">
                                                      Received {formatNotificationTime(selectedNotification.createdAt)}
                                                </p>
                                          </div>
                                          <button
                                                type="button"
                                                onClick={() => setSelectedNotification(null)}
                                                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                                          >
                                                <X className="w-5 h-5" />
                                          </button>
                                    </div>

                                    <div className="py-2 text-sm text-neutral-300 leading-relaxed max-h-60 overflow-y-auto">{selectedNotification.message}</div>

                                    {selectedNotification.orderId && (
                                          <div className="mt-4 p-3 rounded-xl bg-purple-950/20 border border-purple-800/30 flex items-center justify-between text-xs text-purple-300">
                                                <span>
                                                      Associated Order: <strong>{selectedNotification.orderId}</strong>
                                                </span>
                                          </div>
                                    )}

                                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-neutral-800/60 pt-4">
                                          <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={(e) => handleDeleteOne(e, selectedNotification.id)}
                                                className="gap-2"
                                          >
                                                <Trash2 className="w-4 h-4" /> Delete
                                          </Button>
                                          <Button variant="neutral" size="sm" onClick={() => setSelectedNotification(null)}>
                                                Close
                                          </Button>
                                    </div>
                              </div>
                        </div>
                  )}
            </div>
      );
}
