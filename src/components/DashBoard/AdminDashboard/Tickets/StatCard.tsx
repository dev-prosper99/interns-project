import type { SVGProps } from "react";

interface StatCardProps {
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
}

export function StatCard({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className={`flex h-7 w-7 items-center justify-center rounded-md ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </span>
        <span className="text-sm text-neutral-400">{label}</span>
      </div>

      <p className="text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}