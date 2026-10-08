const API_BASE_URL = "https://peacemaker001-001-site1.ltempurl.com";

export interface AppNotification {
      id: string;
      title: string;
      message: string;
      isRead: boolean;
      createdAt: string;
      type?: string;
      orderId?: string;
      metadata?: Record<string, unknown>;
}

export interface NotificationPreferences {
      emailNotifications: boolean;
      smsNotifications: boolean;
      eventReminders: boolean;
      eventUpdates: boolean;
      promotionsAndOffers: boolean;
      newEvents: boolean;
}

export interface DeliveryLog {
      id: string;
      recipient: string;
      channel: "Email" | "SMS" | string;
      subject?: string;
      status: "Delivered" | "Sent" | "Failed" | "Pending" | string;
      sentAt: string;
      errorMessage?: string;
}

interface ApiResponse<T> {
      success?: boolean;
      status?: number;
      message?: string;
      error?: string;
      data?: T;
}

export class ApiError extends Error {
      status: number;
      constructor(message: string, status: number) {
            super(message);
            this.name = "ApiError";
            this.status = status;
      }
}

function getStoredToken(): string {
      if (typeof window === "undefined") return "";
      const tokenKeys = ["token", "accessToken", "authToken", "jwt", "bearerToken"];
      for (const key of tokenKeys) {
            let val = localStorage.getItem(key);
            if (val) {
                  val = val.trim();
                  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                        val = val.slice(1, -1).trim();
                  }
                  if (val === "null" || val === "undefined") continue;
                  return val.startsWith("Bearer ") ? val.slice(7).trim() : val;
            }
      }
      return "";
}

function getAuthHeaders(hasBody = false): Record<string, string> {
      const token = getStoredToken();
      const headers: Record<string, string> = {
            Accept: "application/json",
      };

      if (hasBody) {
            headers["Content-Type"] = "application/json";
      }

      if (token) {
            headers["Authorization"] = `Bearer ${token}`;
      }

      return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
      const hasBody = Boolean(options.body);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                  ...getAuthHeaders(hasBody),
                  ...(options.headers || {}),
            },
      });

      const json: ApiResponse<T> | null = await response.json().catch(() => null);

      if (!response.ok) {
            const errorMsg = json?.message || json?.error || `Request failed with status ${response.status}`;
            throw new ApiError(errorMsg, response.status);
      }

      return (json?.data !== undefined ? json.data : (json as unknown as T)) as T;
}

export const notificationsApi = {
      getNotifications(): Promise<AppNotification[]> {
            return request<AppNotification[]>("/api/Notifications", {
                  method: "GET",
            });
      },

      clearAllNotifications(): Promise<void> {
            return request<void>("/api/Notifications", {
                  method: "DELETE",
            });
      },

      getUnreadCount(): Promise<number | { count: number }> {
            return request<number | { count: number }>("/api/Notifications/unread-count", {
                  method: "GET",
            });
      },

      getNotificationById(notificationId: string): Promise<AppNotification> {
            return request<AppNotification>(`/api/Notifications/${encodeURIComponent(notificationId)}`, {
                  method: "GET",
            });
      },

      deleteNotification(notificationId: string): Promise<void> {
            return request<void>(`/api/Notifications/${encodeURIComponent(notificationId)}`, {
                  method: "DELETE",
            });
      },

      markAsRead(notificationId: string): Promise<void> {
            return request<void>(`/api/Notifications/${encodeURIComponent(notificationId)}/read`, {
                  method: "PATCH",
            });
      },

      markAsUnread(notificationId: string): Promise<void> {
            return request<void>(`/api/Notifications/${encodeURIComponent(notificationId)}/unread`, {
                  method: "PATCH",
            });
      },

      markAllAsRead(): Promise<void> {
            return request<void>("/api/Notifications/read-all", {
                  method: "PATCH",
            });
      },

      getPreferences(): Promise<NotificationPreferences> {
            return request<NotificationPreferences>("/api/Notifications/preferences", {
                  method: "GET",
            });
      },

      updatePreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
            return request<NotificationPreferences>("/api/Notifications/preferences", {
                  method: "PUT",
                  body: JSON.stringify(preferences),
            });
      },

      resendOrderConfirmation(orderId: string): Promise<{ success: boolean; message: string }> {
            return request<{ success: boolean; message: string }>(`/api/Notifications/orders/${encodeURIComponent(orderId)}/resend-confirmation`, {
                  method: "POST",
            });
      },

      sendTestEmail(payload: { email: string; subject?: string; message?: string }): Promise<{ success: boolean; message: string }> {
            const targetEmail = payload.email.trim();
            const subject = payload.subject?.trim() || "Tix0 System Test Email";
            const message = payload.message?.trim() || "This is a diagnostic test email from Tix0";

            const body = {
                  to: targetEmail,
                  To: targetEmail,
                  email: targetEmail,
                  subject: subject,
                  message: message,
                  body: message,
            };

            return request<{ success: boolean; message: string }>("/api/Notifications/test-email", {
                  method: "POST",
                  body: JSON.stringify(body),
            });
      },

      getDeliveryLogs(): Promise<DeliveryLog[]> {
            return request<DeliveryLog[]>("/api/Notifications/delivery-logs", {
                  method: "GET",
            });
      },
};
