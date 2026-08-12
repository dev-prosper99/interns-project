import React from 'react';

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';


const fallbackData = [
  { month: 'Jan', revenue: 100000 },
  { month: 'Feb', revenue: 300000 },
  { month: 'Mar', revenue: 600000 },
  { month: 'Apr', revenue: 250000 },
  { month: 'May', revenue: 550000 },
  { month: 'Jun', revenue: 350000 },
  { month: 'Jul', revenue: 700000 },
  { month: 'Aug', revenue: 800000 },
  { month: 'Sep', revenue: 900000 },
  { month: 'Oct', revenue: 750000 },
  { month: 'Nov', revenue: 950000 },
  { month: 'Dec', revenue: 1100000 },
];

type Props = {
  data?: Array<{ name?: string; value?: number; month?: string; revenue?: number }>;
};

const RevenueChart: React.FC<Props> = ({ data }) => {
  const chartData = (data ?? fallbackData).map((d) => {
    const month = 'month' in d && typeof d.month === 'string' ? d.month : (d as any).name ?? '';
    const revenue = 'revenue' in d && typeof d.revenue === 'number' ? d.revenue : (d as any).value ?? 0;
    return { month, revenue };
  });

  return (
    <div className="bg-[#111111] border border-[#262626] rounded-2xl p-6 h-full flex flex-col">
      <h2 className="text-2xl font-semibold text-white mb-8">Monthly revenue performance</h2>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.75} />
              <stop offset="100%" stopColor="#DDCAFD" stopOpacity={0.06} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#2A2A2A" strokeDasharray="3 3" vertical={true} />

          <XAxis dataKey="month" tick={{ fill: '#BDBDBD', fontSize: 14 }} tickLine={false} axisLine={false} />

          <YAxis
            tickFormatter={(value: number) => (value === 0 ? '0' : `₦${value / 1000}K`)}
            tick={{ fill: '#BDBDBD', fontSize: 14 }}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            contentStyle={{
              background: '#1A1A1A',
              border: 'none',
              borderRadius: '16px',
              color: '#fff',
            }}
            
          />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#7C3AED"
            strokeWidth={3}
            fill="url(#revenue)"
            dot={false}
            activeDot={{ r: 6, fill: '#7C3AED', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;