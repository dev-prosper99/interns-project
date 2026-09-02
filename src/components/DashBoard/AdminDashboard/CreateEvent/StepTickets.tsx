import { DeleteIcon, PlusIcon } from "@/assets/icons";
import { TextInput } from "./FormControls";
import { emptyTier } from "../../../../constants/eventOptions";
import { Button } from "@/components/ui/button";
import type { EventFormData, FormUpdater, Tier } from "./types";

interface StepTicketsProps {
  form: EventFormData;
  update: FormUpdater;
}

export default function StepTickets({ form, update }: StepTicketsProps) {
  const setTier = (id: string, patch: Partial<Tier>) =>
    update({ tiers: form.tiers.map((t) => (t.id === id ? { ...t, ...patch } : t)) });

  const addTier = () => update({ tiers: [...form.tiers, emptyTier()] });
  const removeTier = (id: string) =>
    update({ tiers: form.tiers.length > 1 ? form.tiers.filter((t) => t.id !== id) : form.tiers });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-neutral-200">Ticket Types</h3>
        <Button
          type="button"
          onClick={addTier}
          variant="secondary"
          className="h-9 px-3 text-sm gap-1.5"
        >
          <PlusIcon /> Add Tier
        </Button>
      </div>

      <div className="space-y-4">
        {form.tiers.map((tier, i) => (
          <div key={tier.id} className="rounded-lg border border-neutral-800 bg-neutral-800/30 p-4 relative">
            {form.tiers.length > 1 && (
              <Button
                type="button"
                onClick={() => removeTier(tier.id)}
                variant="inactive"
                className="absolute top-2 right-2 h-8 w-8 rounded-full p-0 text-neutral-500 hover:text-red-400"
                aria-label="Remove tier"
              >
                < DeleteIcon/>
              </Button>
            )}
            <p className="text-xs text-neutral-500 mb-3">Tier {i + 1}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <TextInput
                label="Tier Name"
                required
                placeholder="Enter Ticket Name"
                value={tier.name}
                onChange={(e) => setTier(tier.id, { name: e.target.value })}
              />
              <TextInput
                label="Price (NGN)"
                required
                type="number"
                placeholder="0 for free"
                value={tier.price}
                onChange={(e) => setTier(tier.id, { price: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="Total Quantity"
                required
                type="number"
                placeholder="eg. 500"
                value={tier.quantity}
                onChange={(e) => setTier(tier.id, { quantity: e.target.value })}
              />
              <TextInput
                label="Description"
                placeholder="Brief Description"
                value={tier.description}
                onChange={(e) => setTier(tier.id, { description: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
