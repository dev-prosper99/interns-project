import React from "react";
import {uploadIcon as Upload} from "@/assets/icons";
import { TextInput, TextArea, Select, FieldLabel } from "./FormControls";
import { CATEGORIES, STATES, CITIES } from "../constants/eventOptions";

export default function StepBasics({ form, update }) {
  const cityOptions = form.state ? CITIES[form.state] || [] : [];

  const handleBanner = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update({ bannerImage: file, bannerPreview: reader.result });
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
          placeholder="Select State"
          options={STATES}
          value={form.state}
          onChange={(e) => update({ state: e.target.value, city: "" })}
        />
        <Select
          label="City"
          required
          placeholder="Select City"
          options={cityOptions}
          value={form.city}
          disabled={!form.state}
          onChange={(e) => update({ city: e.target.value })}
        />
      </div>

      <div>
        <FieldLabel required>Banner Image</FieldLabel>
        <label className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-700 bg-neutral-800/40 py-8 cursor-pointer hover:border-purple-500 transition-colors">
          {form.bannerPreview ? (
            <img src={form.bannerPreview} alt="Banner preview" className="max-h-32 rounded-md object-cover" />
          ) : (
            <>
              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <Upload size={14}  />
              </span>
              <span className="text-sm text-neutral-300">
                <span className="text-purple-400">Click to upload</span> or drag and drop
              </span>
              <span className="text-xs text-neutral-500">Png, Jpg, Gif (max. 5mb)</span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleBanner} />
        </label>
      </div>
    </div>
  );
}
