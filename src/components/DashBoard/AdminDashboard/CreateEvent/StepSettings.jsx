import React from "react";
import { TextInput, TextArea, RadioOption } from "./FormControls";
import { REFUND_POLICIES } from "../constants/eventOptions";

export default function StepSettings({ form, update }) {
  return (
    <div className="space-y-7">
      <div>
        <h3 className="text-sm font-semibold text-neutral-200 mb-4">Event Settings</h3>
        <TextInput
          label="Promo Code"
          placeholder="e.g EARLYBIRD20"
          value={form.promoCode}
          onChange={(e) => update({ promoCode: e.target.value })}
        />
        <p className="text-xs text-neutral-500 mt-1.5">Leave blank to disable promo codes</p>

        {form.promoCode && (
          <div className="mt-3">
            <TextInput
              label="Discount (%)"
              type="number"
              placeholder="e.g 20"
              value={form.discount}
              onChange={(e) => update({ discount: e.target.value })}
            />
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-neutral-200 mb-4">Refund Policy</h3>
        <div className="space-y-4">
          {REFUND_POLICIES.map((policy) => (
            <RadioOption
              key={policy.key}
              label={policy.label}
              selected={form.refundPolicy === policy.key}
              onClick={() => update({ refundPolicy: policy.key })}
            >
              {policy.key === "custom" && form.refundPolicy === "custom" && (
                <div className="mt-2 ml-7">
                  <TextArea
                    placeholder="Describe your custom refund policy"
                    value={form.customRefundNote}
                    onChange={(e) => update({ customRefundNote: e.target.value })}
                  />
                </div>
              )}
            </RadioOption>
          ))}
        </div>
      </div>
    </div>
  );
}
