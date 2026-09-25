import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { Camera } from "lucide-react";
import { Tabs, TextField, PasswordField, ToggleSwitch, SaveBar, initialsFrom, type TabKey, type StatusKind } from "./SettingsUI";
import Loader from "@/components/layouts/Loader";
import { getStoredAvatarUrl, storeAvatarUrl, uploadProfileImage } from "@/lib/api";

interface ProfileData {
      id: string;
      email: string;
      fullName: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      isActive: boolean;
      createdAt: string;
      city?: string;
}

interface NotificationPreferences {
      emailNotifications: boolean;
      smsNotifications: boolean;
      eventReminders?: boolean;
      eventUpdates?: boolean;
      promotionsAndOffers?: boolean;
      newEvents?: boolean;
}

interface ApiResponse<T> {
      status?: number;
      success?: boolean;
      message?: string;
      errors?: string[];
      data?: T;
}

interface UpdateProfilePayload {
      fullName: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
}

const API_BASE = "https://peacemaker001-001-site1.ltempurl.com";

const TOKEN_STORAGE_KEYS = ["token", "accessToken", "authToken"];

function getStoredToken(): string | undefined {
      for (const key of TOKEN_STORAGE_KEYS) {
            const value = localStorage.getItem(key);
            if (value) return value;
      }
      return undefined;
}

function authHeaders(token?: string): HeadersInit {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      return headers;
}

async function parseOrThrow<T>(res: Response): Promise<T> {
      if (res.status === 404) {
            throw new Error("Endpoint not found (404).");
      }
      if (res.status === 401) {
            throw new Error("Not logged in, or your session has expired.");
      }
      const body: ApiResponse<T> | null = await res.json().catch(() => null);
      if (!res.ok || (body && body.success === false)) {
            throw new Error(body?.message || body?.errors?.[0] || `Request failed (${res.status})`);
      }
      return (body?.data !== undefined ? body.data : (body as unknown as T)) as T;
}

async function getProfile(token?: string): Promise<ProfileData> {
      const res = await fetch(`${API_BASE}/api/Profile`, {
            method: "GET",
            headers: authHeaders(token),
      });
      return parseOrThrow<ProfileData>(res);
}

async function updateProfile(payload: UpdateProfilePayload, token?: string): Promise<ProfileData> {
      const res = await fetch(`${API_BASE}/api/Profile`, {
            method: "PUT",
            headers: authHeaders(token),
            body: JSON.stringify(payload),
      });
      return parseOrThrow<ProfileData>(res);
}

async function getNotificationPreferences(token?: string): Promise<NotificationPreferences> {
      const res = await fetch(`${API_BASE}/api/Notifications/preferences`, {
            method: "GET",
            headers: authHeaders(token),
      });
      return parseOrThrow<NotificationPreferences>(res);
}

async function updateNotificationPreferences(payload: Partial<NotificationPreferences>, token?: string): Promise<NotificationPreferences> {
      const res = await fetch(`${API_BASE}/api/Notifications/preferences`, {
            method: "PUT",
            headers: authHeaders(token),
            body: JSON.stringify(payload),
      });
      return parseOrThrow<NotificationPreferences>(res);
}

function useProfile(tokenProp?: string) {
      const token = tokenProp ?? getStoredToken();

      const [profile, setProfile] = useState<ProfileData | null>(null);
      const [loadMsg, setLoadMsg] = useState(() => (token ? "Loading profile…" : "You're not logged in — no auth token found."));
      const [isLoading, setIsLoading] = useState(() => Boolean(token));
      const [saving, setSaving] = useState(false);

      useEffect(() => {
            let isMounted = true;

            if (!token) return;

            getProfile(token)
                  .then((data) => {
                        if (!isMounted) return;
                        setProfile(data);
                        setLoadMsg("Profile loaded.");
                  })
                  .catch((err: Error) => {
                        if (!isMounted) return;
                        setLoadMsg(`Could not load profile (${err.message}).`);
                  })
                  .finally(() => {
                        if (isMounted) {
                              setIsLoading(false);
                        }
                  });

            return () => {
                  isMounted = false;
            };
      }, [token]);

      const save = useCallback(
            async (payload: UpdateProfilePayload): Promise<{ ok: boolean; error?: string }> => {
                  if (!token) return { ok: false, error: "Not logged in." };
                  setSaving(true);
                  try {
                        const updated = await updateProfile(payload, token);
                        setProfile(updated);
                        return { ok: true };
                  } catch (err) {
                        return { ok: false, error: (err as Error).message };
                  } finally {
                        setSaving(false);
                  }
            },
            [token],
      );

      return { profile, loadMsg, saving, isLoading, save };
}

function ProfileInfoTab({
      profile,
      loadMsg,
      saving,
      onSave,
}: {
      profile: ProfileData | null;
      loadMsg: string;
      saving: boolean;
      onSave: (payload: UpdateProfilePayload) => Promise<{ ok: boolean; error?: string }>;
}) {
      const [fullName, setFullName] = useState(() => profile?.fullName || [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "");
      const [phoneNumber, setPhoneNumber] = useState(() => profile?.phoneNumber || "");
      const [city, setCity] = useState(() => profile?.city || "");
      const [avatarUrl, setAvatarUrl] = useState(() => getStoredAvatarUrl(profile?.email));
      const [status, setStatus] = useState("");
      const [statusKind, setStatusKind] = useState<StatusKind>("");
      const [isUploading, setIsUploading] = useState(false);
      const fileInputRef = useRef<HTMLInputElement>(null);

      async function handleSave() {
            setStatus("Saving…");
            setStatusKind("pending");
            const [firstName, ...rest] = fullName.trim().split(/\s+/);
            const result = await onSave({
                  fullName: fullName.trim(),
                  firstName: firstName || "",
                  lastName: rest.join(" "),
                  phoneNumber,
            });
            if (result.ok) {
                  setStatus("Saved successfully.");
                  setStatusKind("ok");
            } else {
                  setStatus(`Save failed: ${result.error}`);
                  setStatusKind("err");
            }
      }

      async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;

            setIsUploading(true);
            setStatus("");
            setStatusKind("");
            try {
                  const imageUrl = await uploadProfileImage(file);
                  setAvatarUrl(imageUrl);
                  storeAvatarUrl(imageUrl, profile?.email);
                  setStatus("Profile photo updated successfully.");
                  setStatusKind("ok");
            } catch (error) {
                  setStatus(error instanceof Error ? error.message : "Could not upload your profile photo.");
                  setStatusKind("err");
            } finally {
                  setIsUploading(false);
            }
      }

      return (
            <div className="flex min-h-85 flex-col rounded-xl border border-neutral-700 bg-neutral-1000 p-7 ">
                  <div className="mb-6 text-base font-semibold">Profile Information</div>
                  <div className="pb-4 text-xs text-gray-400">{loadMsg}</div>

                  <div className="mb-7 flex items-center gap-4">
                        <div className="relative h-13 w-13">
                              {avatarUrl ? (
                                    <img src={avatarUrl} alt="Profile" className="h-13 w-13 rounded-full object-cover" />
                              ) : (
                                    <div className="flex h-13 w-13 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-fuchsia-400 text-base font-semibold text-white">
                                          {initialsFrom(fullName)}
                                    </div>
                              )}
                              <button
                                    type="button"
                                    aria-label="Upload profile photo"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-neutral-900 bg-neutral-200 text-neutral-600 shadow-lg"
                              >
                                    <Camera size={14} />
                              </button>
                              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </div>
                        <div>
                              <div className="text-sm font-medium">Profile photo</div>
                              <div className="mt-0.5 text-xs text-gray-400">This image will be displayed on your profile</div>
                        </div>
                  </div>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                        <TextField id="fullName" label="Full Name" value={fullName} onChange={setFullName} />
                        <TextField id="email" label="Email Address" value={profile?.email || ""} disabled />
                        <TextField id="phoneNumber" label="Phone Number" value={phoneNumber} onChange={setPhoneNumber} />
                        <TextField id="city" label="City" value={city} onChange={setCity} />
                  </div>

                  <SaveBar status={status} statusKind={statusKind} onSave={handleSave} saving={saving} />
            </div>
      );
}

function NotificationsTab({ token }: { token?: string }) {
      const [emailNotif, setEmailNotif] = useState(true);
      const [smsNotif, setSmsNotif] = useState(false);
      const [status, setStatus] = useState("");
      const [statusKind, setStatusKind] = useState<StatusKind>("");
      const [saving, setSaving] = useState(false);

      useEffect(() => {
            let isMounted = true;

            if (!token) return;

            getNotificationPreferences(token)
                  .then((data) => {
                        if (!isMounted) return;
                        if (typeof data.emailNotifications === "boolean") {
                              setEmailNotif(data.emailNotifications);
                        }
                        if (typeof data.smsNotifications === "boolean") {
                              setSmsNotif(data.smsNotifications);
                        }
                  })
                  .catch((err: Error) => {
                        if (!isMounted) return;
                        setStatus(`Could not load preferences (${err.message}).`);
                        setStatusKind("err");
                  });

            return () => {
                  isMounted = false;
            };
      }, [token]);

      async function handleSave() {
            if (!token) {
                  setStatus("Not logged in.");
                  setStatusKind("err");
                  return;
            }

            setSaving(true);
            setStatus("Saving…");
            setStatusKind("pending");

            try {
                  const updated = await updateNotificationPreferences(
                        {
                              emailNotifications: emailNotif,
                              smsNotifications: smsNotif,
                        },
                        token,
                  );
                  if (typeof updated.emailNotifications === "boolean") {
                        setEmailNotif(updated.emailNotifications);
                  }
                  if (typeof updated.smsNotifications === "boolean") {
                        setSmsNotif(updated.smsNotifications);
                  }
                  setStatus("Notification preferences saved successfully.");
                  setStatusKind("ok");
            } catch (err) {
                  setStatus(err instanceof Error ? err.message : "Failed to update notification preferences.");
                  setStatusKind("err");
            } finally {
                  setSaving(false);
            }
      }

      return (
            <div className="flex min-h-85 flex-col rounded-xl border border-neutral-800 bg-neutral-900 p-7">
                  <div className="mb-6 text-base font-semibold">Notification Preferences</div>

                  <div className="flex items-start justify-between border-b border-neutral-800 py-4">
                        <div>
                              <div className="mb-0.5 text-sm font-medium">Email Notifications</div>
                              <div className="text-xs text-gray-400">Receive email notifications</div>
                        </div>
                        <ToggleSwitch id="emailNotif" checked={emailNotif} onChange={setEmailNotif} />
                  </div>

                  <div className="flex items-start justify-between py-4">
                        <div>
                              <div className="mb-0.5 text-sm font-medium">SMS Notifications</div>
                              <div className="text-xs text-gray-400">Receive important updates via text message</div>
                        </div>
                        <ToggleSwitch id="smsNotif" checked={smsNotif} onChange={setSmsNotif} />
                  </div>

                  <SaveBar status={status} statusKind={statusKind} onSave={handleSave} saving={saving} />
            </div>
      );
}

function SecurityTab({ email }: { email: string }) {
      const [currentPw, setCurrentPw] = useState("");
      const [newPw, setNewPw] = useState("");
      const [confirmPw, setConfirmPw] = useState("");
      const [status, setStatus] = useState("No password-change endpoint provided yet — this tab is UI-only.");
      const [statusKind, setStatusKind] = useState<StatusKind>("");

      function handleSave() {
            if ((newPw || confirmPw) && newPw !== confirmPw) {
                  setStatus("New password and confirmation do not match.");
                  setStatusKind("err");
                  return;
            }
            setStatus("No password-change endpoint provided yet — nothing was sent.");
            setStatusKind("pending");
      }

      return (
            <div className="flex min-h-85 flex-col rounded-xl border border-neutral-800 bg-neutral-900 p-7">
                  <div className="mb-6 text-base font-semibold">Security</div>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                        <TextField id="secEmail" label="Email Address" value={email} disabled />
                        <PasswordField id="currentPw" label="Current Password" value={currentPw} onChange={setCurrentPw} />
                        <PasswordField id="newPw" label="New Password" value={newPw} onChange={setNewPw} />
                        <PasswordField id="confirmPw" label="Confirm Password" value={confirmPw} onChange={setConfirmPw} />
                  </div>

                  <SaveBar status={status} statusKind={statusKind} onSave={handleSave} />
            </div>
      );
}

interface AccountSettingsPageProps {
      token?: string;
}

export default function AccountSettingsPage({ token }: AccountSettingsPageProps) {
      const [activeTab, setActiveTab] = useState<TabKey>("profile");
      const resolvedToken = token ?? getStoredToken();
      const { profile, loadMsg, saving, isLoading, save } = useProfile(resolvedToken);

      if (isLoading) return <Loader />;

      return (
            <div className="min-w-0 bg-neutral-950 text-neutral-100">
                  <div className="w-full px-5 py-8">
                        <h1 className="mb-5 text-xl font-semibold">Manage your account and preferences</h1>

                        <Tabs active={activeTab} onChange={setActiveTab} />

                        {activeTab === "profile" && (
                              <ProfileInfoTab
                                    key={profile?.id ?? profile?.email ?? "profile-tab"}
                                    profile={profile}
                                    loadMsg={loadMsg}
                                    saving={saving}
                                    onSave={save}
                              />
                        )}
                        {activeTab === "notifications" && <NotificationsTab token={resolvedToken} />}
                        {activeTab === "security" && <SecurityTab email={profile?.email || ""} />}
                  </div>
            </div>
      );
}
