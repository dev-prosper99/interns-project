import type { SVGProps } from "react";

export type DashboardStat = {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  iconBg: string;
  iconColor: string;
};

type Props = {
  stat: DashboardStat;
};

const DashboardStatCard = ({ stat }: Props) => {
  const Icon = stat.icon;

  return (
    <div className="bg-neutral-1000 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.iconBg}`}
        >
          <Icon className={`w-4 h-4 ${stat.iconColor}`} />
        </div>

        <span className="text-sm font-medium text-gray-300">
          {stat.title}
        </span>
      </div>

      <h2 className="text-4xl font-bold text-white tracking-tight">
        {stat.value}
      </h2>

      <div className="flex items-center gap-2 mt-6 text-sm">
        <span
          className={`font-semibold ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}
        >
          {stat.change}
        </span>

        <span className="text-gray-500">from last month</span>
      </div>
    </div>
  );
};

export default DashboardStatCard;