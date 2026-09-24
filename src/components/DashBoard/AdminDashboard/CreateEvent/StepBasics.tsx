import React, { useEffect, useState } from "react";
import { TextInput, TextArea, Select } from "./FormControls";
import { CATEGORIES } from "../../../../constants/eventOptions";
import { fetchStates, fetchCitiesByState, type LocationOption } from "../../../../lib/nigeriaLocations";
import { UploadIcon } from "../../../../assets/icons";
import { Info } from "lucide-react";
import type { EventFormData, FormUpdater } from "./types";

interface StepBasicsProps {
      form: EventFormData;
      update: FormUpdater;
}

export default function StepBasics({ form, update }: StepBasicsProps) {
      const [stateOptions, setStateOptions] = useState<LocationOption[]>([]);
      const [cityOptions, setCityOptions] = useState<LocationOption[]>([]);
      const [loadingStates, setLoadingStates] = useState(false);
      const [loadingCities, setLoadingCities] = useState(false);
      const [locationError, setLocationError] = useState<string | null>(null);

      useEffect(() => {
            let cancelled = false;
            setLoadingStates(true);
            setLocationError(null);
            fetchStates()
                  .then((states) => {
                        if (!cancelled) setStateOptions(states);
                  })
                  .catch(() => {
                        if (!cancelled) setLocationError("Couldn't load states. Please try again.");
                  })
                  .finally(() => {
                        if (!cancelled) setLoadingStates(false);
                  });
            return () => {
                  cancelled = true;
            };
      }, []);

      useEffect(() => {
            if (!form.state) {
                  setCityOptions([]);
                  return;
            }
            let cancelled = false;
            setLoadingCities(true);
            setLocationError(null);
            fetchCitiesByState(form.state)
                  .then((cities) => {
                        if (!cancelled) setCityOptions(cities);
                  })
                  .catch(() => {
                        if (!cancelled) setLocationError("Couldn't load cities for this state.");
                  })
                  .finally(() => {
                        if (!cancelled) setLoadingCities(false);
                  });
            return () => {
                  cancelled = true;
            };
      }, [form.state]);

      const [bannerError, setBannerError] = useState(false);

      const handleBannerUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const url = e.target.value;
            setBannerError(false);
            update({ bannerUrl: url, bannerPreview: url });
      };

      const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                  const imageUrl = typeof reader.result === "string" ? reader.result : "";
                  if (!imageUrl) return;
                  setBannerError(false);
                  update({ bannerUrl: imageUrl, bannerPreview: imageUrl });
            };
            reader.readAsDataURL(file);
      };

      return (
            <div className="space-y-5">
                  <h3 className="text-sm font-semibold text-neutral-200">Event Details</h3>

                  <TextInput
                        label="Event Title"
                        required
                        placeholder="Enter your event title"
                        value={form.title}
                        onChange={(e) => update({ title: e.target.value })}
                  />

                  <TextArea
                        label="Description"
                        required
                        placeholder="Describe your event"
                        value={form.description}
                        maxLength={1000}
                        onChange={(e) => update({ description: e.target.value })}
                        hint={`${form.description.length}/1000 characters`}
                  />

                  <div className="grid grid-cols-2 gap-4">
                        <Select
                              label="Category"
                              required
                              placeholder="Select Category"
                              options={CATEGORIES}
                              value={form.category}
                              onChange={(e) => update({ category: e.target.value })}
                        />

                        {form.category === "Other" && (
                              <TextInput
                                    label="Custom Category"
                                    required
                                    placeholder="Enter category"
                                    value={form.customCategory ?? ""}
                                    onChange={(e) => update({ customCategory: e.target.value })}
                              />
                        )}
                        <TextInput label="Start Date" required type="date" value={form.startDate} onChange={(e) => update({ startDate: e.target.value })} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                        <TextInput
                              label="Start Date"
                              required
                              type="date"
                              max="9999-12-31"
                              value={form.startDate}
                              onChange={(e) => update({ startDate: e.target.value })}
                        />

                        <TextInput
                              label="End Date (Optional)"
                              type="date"
                              max="9999-12-31"
                              value={form.endDate}
                              onChange={(e) => update({ endDate: e.target.value })}
                        />
                  </div>

                  <TextInput
                        label="Venue"
                        required
                        placeholder="e.g. Eko hotels and suite"
                        value={form.venue}
                        onChange={(e) => update({ venue: e.target.value })}
                  />

                  <div className="grid grid-cols-2 gap-4">
                        <Select
                              label="State"
                              required
                              placeholder={loadingStates ? "Loading states…" : "Select State"}
                              options={stateOptions}
                              value={form.state}
                              disabled={loadingStates}
                              onChange={(e) => update({ state: e.target.value, city: "" })}
                        />
                        <Select
                              label="City"
                              required
                              placeholder={loadingCities ? "Loading cities…" : "Select City"}
                              options={cityOptions}
                              value={form.city}
                              disabled={!form.state || loadingCities}
                              onChange={(e) => update({ city: e.target.value })}
                        />
                  </div>
                  {locationError && <p className="text-xs text-red-400">{locationError}</p>}

                  <div className="">
                        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-end sm:gap-4">
                              <TextInput
                                    className="sm:w-full"
                                    label="Banner Image URL"
                                    required
                                    placeholder="https://example.com/banner.jpg"
                                    value={form.bannerUrl ?? ""}
                                    onChange={handleBannerUrlChange}
                              />
                              <div className="flex items-center gap-2 sm:w-full">
                                    <input id="banner-image-upload" type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
                                    <label
                                          htmlFor="banner-image-upload"
                                          className="flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-purple-500/60 bg-purple-500/10 px-2 text-xs font-medium text-purple-300 transition-colors hover:bg-purple-500/20"
                                    >
                                          <UploadIcon className="h-4 w-4" />
                                          <span>Upload</span>
                                    </label>
                              </div>
                        </div>
                        <div className="mt-2 flex items-start gap-2">
                              <p className="min-w-0 w-fit text-xs leading-5 text-neutral-500">Paste a hosted image link (PNG, JPG, or GIF).</p>
                              <span
                                    className="group  relative shrink-0"
                                    title="Copy an image address from your browser, then paste it into the image URL field."
                              >
                                    <Info
                                          className="mt-0.5 h-4 w-4 cursor-help text-neutral-400 transition-colors group-hover:text-purple-300"
                                          aria-label="How to add an image"
                                    />
                                    <span className="pointer-events-none absolute bottom-full right-0 z-10 mb-2 hidden w-72 rounded-lg border border-neutral-700 bg-neutral-900 p-3 text-left text-xs leading-5 text-neutral-200 shadow-xl shadow-black/30 group-hover:block group-focus-within:block">
                                          Find an image online, right-click it, choose <strong>Copy image address</strong>, then paste the link into the image
                                          URL field.
                                    </span>
                              </span>
                        </div>
                        {form.bannerPreview && !bannerError && (
                              <div className="mt-3 rounded-lg border border-neutral-700 bg-neutral-800/40 p-2">
                                    <img
                                          src={form.bannerPreview}
                                          alt="Banner preview"
                                          className="max-h-32 w-full rounded-md object-cover"
                                          onError={() => setBannerError(true)}
                                          onLoad={() => setBannerError(false)}
                                    />
                              </div>
                        )}
                        {form.bannerPreview && bannerError && <p className="mt-2 text-xs text-red-400">Couldn't load an image from that URL.</p>}
                  </div>
            </div>
      );
}
