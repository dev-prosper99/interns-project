import { STEPS } from "../../../../constants/eventOptions";
import { TickIcon } from "@/assets/icons";

interface StepperProps {
  currentIndex: number;
}

export default function Stepper({ currentIndex }: StepperProps) {
  return (
    <div className="grid grid-cols-4 overflow-hidden rounded-xl border border-white/10 bg-[#121212] mb-7">
      {STEPS.map((step, i) => {
        const state = i < currentIndex ? "done" : i === currentIndex ? "active" : "upcoming";
        const stepNumber = i + 1;
        return (
          <div
            key={step.key}
            className={`min-h-17 px-4 py-3 flex items-center gap-3 border-r border-white/10 transition-colors last:border-r-0 ${
              state === "active"
                ? "bg-[#3b2466]"
                : state === "done"
                ? "bg-[#7c3aed]"
                : "bg-[#161616]"
            }`}
          >
            <span
              className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                state === "done"
                  ? "bg-white text-violet-700"
                  : state === "active"
                  ? "bg-white text-violet-700"
                  : "bg-white/20 text-white/80"
              }`}
            >
              {state === "done" ? (
                <TickIcon className="h-3.5 w-3.5 text-violet-700" />
              ) : (
                <span>{stepNumber}</span>
              )}
            </span>
            <span className="min-w-0">
              <span
                className={`block text-[13px] font-medium truncate ${
                  state === "upcoming" ? "text-neutral-300" : "text-white"
                }`}
              >
                {step.label}
              </span>
              <span
                className={`block text-[11px] truncate ${
                  state === "upcoming" ? "text-neutral-500" : state === "done" ? "text-white/85" : "text-white/75"
                }`}
              >
                {step.sub}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
