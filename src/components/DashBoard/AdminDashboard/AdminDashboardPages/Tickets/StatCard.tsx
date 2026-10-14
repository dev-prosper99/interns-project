import type { SVGProps } from "react";

interface StatCardProps {
      icon: React.ComponentType<SVGProps<SVGSVGElement>>;
      iconColor: string;
      iconBg: string;
      label: string;
      value: string;
}

export function StatCard({ icon: Icon, iconColor, iconBg, label, value }: StatCardProps) {
      return (
            <div className="min-h-24 rounded-lg bg-[#111213] p-4">
                  <div className="mb-3 flex items-center gap-2">
                        <span className={`flex h-6 w-6 items-center justify-center rounded ${iconBg}`}>
                              <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
                        </span>
                        <span className="text-xs font-medium text-neutral-300">{label}</span>
                  </div>

                  <p className="text-2xl font-medium leading-8 text-neutral-100">{value}</p>
            </div>
      );
}
