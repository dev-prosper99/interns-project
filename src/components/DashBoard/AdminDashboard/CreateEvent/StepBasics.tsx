import React, { useEffect, useState } from "react";
import { TextInput, TextArea, Select } from "./FormControls";
import { CATEGORIES } from "../../../../constants/eventOptions";
import { fetchStates, fetchCitiesByState, type LocationOption } from "../../../../lib/nigeriaLocations";
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
        <TextInput
          label="Start Date"
          required
          type="date"
          value={form.startDate}
          onChange={(e) => update({ startDate: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextInput
          label="End Date (Optional)"
          type="date"
          value={form.endDate}
          onChange={(e) => update({ endDate: e.target.value })}
        />
        <TextInput
          label="Start Time"
          required
          type="time"
          value={form.startTime}
          onChange={(e) => update({ startTime: e.target.value })}
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
      {locationError && (
        <p className="text-xs text-red-400">{locationError}</p>
      )}

      <div>
        <TextInput
          label="Banner Image URL"
          required
          placeholder="https://example.com/banner.jpg"
          value={form.bannerUrl ?? ""}
          onChange={handleBannerUrlChange}
        />
        <p className="text-xs text-neutral-500 mt-1.5">
          Paste a link to a hosted image (Png, Jpg, Gif)
        </p>
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
        {form.bannerPreview && bannerError && (
          <p className="mt-2 text-xs text-red-400">Couldn't load an image from that URL.</p>
        )}
      </div>
    </div>
  );
}
