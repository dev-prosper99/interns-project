const API_BASE_URL = "https://peacemaker001-001-site1.ltempurl.com";

export type AuthPayload = Record<string, unknown>;

export type RegisterPayload = {
      firstname: string;
      lastname: string;
      email: string;
      password: string;
      role: "Attendee" | "Organizer";
};

export interface ProfileData {
      id: string;
      email: string;
      fullName: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      city?: string;
      isActive?: boolean;
      createdAt?: string;
}

export interface UpdateProfilePayload {
      fullName: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
}

export function getStoredAvatarUrl(email?: string): string {
      const normalizedEmail = email?.trim().toLowerCase();
      return (normalizedEmail ? localStorage.getItem(`avatarUrl:${normalizedEmail}`) : null) || localStorage.getItem("avatarUrl") || "";
}

export function storeAvatarUrl(url: string, email?: string): void {
      const normalizedEmail = (email || localStorage.getItem("email") || "").trim().toLowerCase();
      if (normalizedEmail) {
            localStorage.setItem(`avatarUrl:${normalizedEmail}`, url);
      }
      localStorage.setItem("avatarUrl", url);
}

export function clearAuthStorage(): void {
      ["token", "refreshToken", "email", "firstName", "fullName", "role"].forEach((key) => localStorage.removeItem(key));
}

interface ApiResponse<T> {
      success?: boolean;
      message?: string;
      errors?: string[];
      data?: T;
}

function getAuthHeaders(): HeadersInit {
      const token = localStorage.getItem("token");
      return {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
}

async function parseApiResponse<T>(response: Response): Promise<T> {
      const body = (await response.json().catch(() => null)) as ApiResponse<T> | T | null;
      const wrappedBody = body as ApiResponse<T> | null;

      if (!response.ok || (wrappedBody && "success" in wrappedBody && wrappedBody.success === false)) {
            const message = wrappedBody && "message" in wrappedBody ? wrappedBody.message || wrappedBody.errors?.[0] : undefined;
            throw new Error(message || `Request failed (${response.status})`);
      }

      if (wrappedBody && "data" in wrappedBody && wrappedBody.data !== undefined) {
            return wrappedBody.data;
      }

      return body as T;
}

async function parseRawApiResponse<T>(response: Response): Promise<T> {
      const body = (await response.json().catch(() => null)) as AuthPayload | null;

      if (!response.ok) {
            throw new Error(String(body?.message || "Request failed"));
      }

      if (body?.success === false) {
            const errors = Array.isArray(body.errors) ? body.errors : [];
            throw new Error(String(body.message || errors[0] || "Request failed"));
      }

      return body as T;
}

export async function loginUser(email: string, password: string): Promise<AuthPayload> {
      const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
      });

      return parseRawApiResponse<AuthPayload>(response);
}

export async function registerUser(payload: RegisterPayload): Promise<AuthPayload> {
      const response = await fetch(`${API_BASE_URL}/api/Auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
      });

      return parseRawApiResponse<AuthPayload>(response);
}

export async function getProfile(): Promise<ProfileData> {
      const response = await fetch(`${API_BASE_URL}/api/Profile`, {
            method: "GET",
            headers: getAuthHeaders(),
      });

      return parseApiResponse<ProfileData>(response);
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<ProfileData> {
      const response = await fetch(`${API_BASE_URL}/api/Profile`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
      });

      return parseApiResponse<ProfileData>(response);
}

export async function uploadProfileImage(file: File): Promise<string> {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/api/Uploads/image?folder=pictures`, {
            method: "POST",
            headers: getAuthHeadersWithoutContentType(),
            body: formData,
      });

      const result = await parseApiResponse<unknown>(response);
      const resultObject = typeof result === "object" && result !== null ? (result as Record<string, unknown>) : null;
      const imageUrl = typeof result === "string" ? result : resultObject?.url || resultObject?.imageUrl || resultObject?.fileUrl;

      if (typeof imageUrl !== "string" || !imageUrl) {
            throw new Error("The image upload response did not include a URL.");
      }

      return imageUrl;
}

function getAuthHeadersWithoutContentType(): HeadersInit {
      const token = localStorage.getItem("token");
      return token ? { Authorization: `Bearer ${token}` } : {};
}
