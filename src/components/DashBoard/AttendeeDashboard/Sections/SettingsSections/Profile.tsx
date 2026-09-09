import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProfile, updateProfile, uploadProfileImage } from "@/lib/api";

export default function Profile() {
      const [fullName, setFullName] = useState("");
      const [email, setEmail] = useState("");
      const [phoneNumber, setPhoneNumber] = useState("");
      const [city, setCity] = useState("");
      const [avatarUrl, setAvatarUrl] = useState(() => localStorage.getItem("avatarUrl") || "");
      const [status, setStatus] = useState("Loading profile...");
      const [isSaving, setIsSaving] = useState(false);
      const [isUploading, setIsUploading] = useState(false);
      const fileInputRef = useRef<HTMLInputElement>(null);

      useEffect(() => {
            getProfile()
                  .then((profile) => {
                        setFullName(profile.fullName || [profile.firstName, profile.lastName].filter(Boolean).join(" "));
                        setEmail(profile.email || "");
                        setPhoneNumber(profile.phoneNumber || "");
                        setCity(profile.city || "");
                        setStatus("");
                  })
                  .catch((error: Error) => setStatus(error.message || "Could not load your profile."));
      }, []);

      const initials =
            fullName
                  .split(" ")
                  .filter(Boolean)
                  .map((name) => name[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "AD";

      const handleSave = async () => {
            const nameParts = fullName.trim().split(/\s+/).filter(Boolean);
            setIsSaving(true);
            setStatus("");

            try {
                  const updatedProfile = await updateProfile({
                        fullName: fullName.trim(),
                        firstName: nameParts[0] || "",
                        lastName: nameParts.slice(1).join(" "),
                        phoneNumber: phoneNumber.trim(),
                  });
                  setFullName(updatedProfile.fullName || fullName);
                  setEmail(updatedProfile.email || email);
                  setPhoneNumber(updatedProfile.phoneNumber || phoneNumber);
                  setCity(updatedProfile.city || city);
                  setStatus("Profile updated successfully.");
            } catch (error) {
                  setStatus(error instanceof Error ? error.message : "Could not update your profile.");
            } finally {
                  setIsSaving(false);
            }
      };

      const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;

            setIsUploading(true);
            setStatus("");
            try {
                  const imageUrl = await uploadProfileImage(file);
                  setAvatarUrl(imageUrl);
                  localStorage.setItem("avatarUrl", imageUrl);
                  setStatus("Profile photo updated successfully.");
            } catch (error) {
                  setStatus(error instanceof Error ? error.message : "Could not upload your profile photo.");
            } finally {
                  setIsUploading(false);
            }
      };

      return (
            <div className="w-full font-poppins">
                  <div className="flex min-h-[calc(100vh-220px)] flex-col rounded-2xl bg-neutral-1000 p-4 py-6 sm:p-6">
                        <h3 className="mb-4 text-lg font-medium text-white">Profile Information</h3>

                        {status && (
                              <p className="mb-4 text-sm text-neutral-400" role="status">
                                    {status}
                              </p>
                        )}

                        <div className="flex items-center gap-4">
                              <div className="relative h-16 w-16">
                                    {avatarUrl ? (
                                          <img src={avatarUrl} loading="lazy" alt="Profile" className="h-16 w-16 rounded-full object-cover" />
                                    ) : (
                                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-xl font-semibold text-white">
                                                {initials}
                                          </div>
                                    )}

                                    <button
                                          type="button"
                                          aria-label="Upload profile photo"
                                          onClick={() => fileInputRef.current?.click()}
                                          disabled={isUploading}
                                          className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-neutral-200 bg-neutral-200 text-neutral-600 shadow-lg"
                                    >
                                          <Camera size={16} />
                                    </button>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                              </div>

                              <div className="flex flex-col">
                                    <span className="text-base font-medium text-white">Profile Photo</span>
                                    <span className="text-sm text-neutral-400">This image will be displayed on your profile</span>
                              </div>
                        </div>

                        <div className="mt-10 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
                              <div className="w-full">
                                    <Input
                                          label="Full name"
                                          type="text"
                                          placeholder="Name"
                                          value={fullName}
                                          onChange={(event) => setFullName(event.target.value)}
                                    />
                              </div>

                              <div className="w-full">
                                    <Input label="Email address" type="email" placeholder="Email" value={email} readOnly />
                              </div>

                              <div className="w-full">
                                    <Input
                                          label="Phone number"
                                          type="tel"
                                          placeholder="Phone"
                                          value={phoneNumber}
                                          onChange={(event) => setPhoneNumber(event.target.value)}
                                    />
                              </div>

                              <div className="w-full">
                                    <Input label="City" type="text" placeholder="Lagos" value={city} onChange={(event) => setCity(event.target.value)} />
                              </div>
                        </div>

                        <div className="mt-auto flex justify-end pt-8">
                              <Button type="button" variant="neutral" size="lg" className="w-full md:w-fit" onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? "Saving..." : "Save Changes"}
                              </Button>
                        </div>
                  </div>
            </div>
      );
}
