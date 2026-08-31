import React from "react";
import { REFUND_POLICIES } from "../../../../constants/eventOptions";
import type { EventFormData } from "./types";

interface SummaryFieldProps {
  label: string;
  value: React.ReactNode;
}

function SummaryField({ label, value }: SummaryFieldProps) {
  return (
    <div>
      <p className="text-xs text-neutral-500 mb-1">{label}</p>
      <p className="text-sm text-neutral-200">{value || "—"}</p>
    </div>
  );
}

interface StepReviewProps {
  form: EventFormData;
}

export default function StepReview({ form }: StepReviewProps) {
  const refundLabel = REFUND_POLICIES.find((p) => p.key === form.refundPolicy)?.label;
  const totalTickets = form.tiers.reduce((sum, t) => sum + (Number(t.quantity) || 0), 0);

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-neutral-200">Review and Publish</h3>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <SummaryField label="Event Title" value={form.title} />
        <SummaryField
          label="Category"
          value={
            form.category && (
              <span className="inline-block rounded-md bg-orange-500/15 text-orange-400 text-xs px-2 py-0.5">
                {form.category}
              </span>
            )
          }
        />
        <SummaryField label="Start Date" value={form.startDate} />
        <SummaryField label="End Date" value={form.endDate || "NA"} />
        <SummaryField label="Start Time" value={form.startTime} />
        <SummaryField label="Venue" value={form.venue} />
        <SummaryField label="State" value={form.state} />
        <SummaryField label="City" value={form.city} />
      </div>

      <div>
        <p className="text-xs text-neutral-500 mb-2">
          Ticket Tiers · {totalTickets.toLocaleString()} total tickets
        </p>
        <div className="rounded-lg bg-neutral-800/50 divide-y divide-neutral-700/60 overflow-hidden">
          {form.tiers.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm text-neutral-200">{t.name || "Untitled tier"}</p>
                <p className="text-xs text-neutral-500">{t.description || "Standard Experience"}</p>
              </div>
              <p className="text-sm text-orange-400 font-medium">
                {Number(t.price) > 0 ? `₦${Number(t.price).toLocaleString()}` : "Free"}
              </p>
              <p className="text-sm text-neutral-400">{Number(t.quantity || 0).toLocaleString()} tickets</p>
            </div>
          ))}
        </div>
      </div>

      {form.promoCode && (
        <div className="rounded-lg bg-green-900/25 border border-green-800/40 px-4 py-3">
          <p className="text-sm text-green-400">
            Promo code {form.promoCode} · {form.discount || 0}% off
          </p>
        </div>
      )}

      <SummaryField label="Refund Policy" value={refundLabel} />
      <SummaryField label="Description" value={form.description} />

      {form.bannerPreview && (
        <div>
          <p className="text-xs text-neutral-500 mb-2">Banner Image</p>
          <img src={form.bannerPreview} alt="Event banner" className="w-full rounded-lg object-cover max-h-56" />
        </div>
      )}
    </div>
  );
}
