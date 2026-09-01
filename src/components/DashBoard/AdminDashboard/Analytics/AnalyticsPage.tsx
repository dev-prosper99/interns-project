"use client";

import { useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import StatsCard from "@/components/DashBoard/AdminDashboard/overview/DashboardStatCard";
import { dashboardStats } from "@/components/DashBoard/AdminDashboard/overview/dashboardStats";
import RevenueChart from "@/components/DashBoard/AdminDashboard/RevenueChart";
import AnalyticsHeader from "@/components/DashBoard/AdminDashboard/Analytics/AnalyticsHeader";
import { Button } from "@/components/ui/button";
import CategoryChart from "@/components/DashBoard/AdminDashboard/CategoryChart";
import TopEvent from "@/components/DashBoard/AdminDashboard/Analytics/TopEvent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExportIcon, CalenderIcon } from "@/assets/icons"; // add CalendarIcon or drop it if you don't have one

const RANGE_LABELS: Record<string, string> = {
  "7": "Last 7 days",
  "30": "Last 30 days",
  "90": "Last 90 days",
};

export default function Analytics() {
  const [range, setRange] = useState<string>("30");

  function handleExport() {
    // Build a CSV from the current stats. Swap in real chart data if you
    // want revenue/category rows included too.
    const rows = [
      ["Metric", "Value", "Range"],
      ...dashboardStats.map((stat) => [
        stat.title,
        String(stat.value ?? ""),
        RANGE_LABELS[range],
      ]),
    ];

    const csvContent = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics-${range}days-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex min-h-screen bg-neutral-900">
      <Sidebar />

      <main className="flex-1">
        <AnalyticsHeader />

        <div className="px-6 flex items-center justify-between">
          <p className="text-white text-[24px] font-medium">
            Insights across all your events
          </p>

          <div className="flex items-center gap-3">
            <Select value={range} onValueChange={(value) => setRange(value as string)}>
              <SelectTrigger
                className="w-44 h-10 rounded-lg bg-neutral-800 border border-neutral-700
                           text-neutral-200 text-sm px-3 gap-2
                           hover:border-neutral-600 focus:ring-1 focus:ring-purple-500
                           focus:ring-offset-0 data-[state=open]:border-purple-500"
              >
                <CalenderIcon className="h-4 w-4 text-neutral-400" />
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="bg-neutral-800 border border-neutral-700 text-neutral-200">
                <SelectItem
                  value="7"
                  className="focus:bg-neutral-700 focus:text-white"
                >
                  Last 7 days
                </SelectItem>
                <SelectItem
                  value="30"
                  className="focus:bg-neutral-700 focus:text-white"
                >
                  Last 30 days
                </SelectItem>
                <SelectItem
                  value="90"
                  className="focus:bg-neutral-700 focus:text-white"
                >
                  Last 90 days
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="primary"
              onClick={handleExport}
              className="flex items-center gap-2 text-white h-10"
            >
              <ExportIcon className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-6">
          {dashboardStats.map((stat) => (
            <StatsCard key={stat.title} stat={stat} />
          ))}
        </div>

        <div className="p-4">
        
                  <RevenueChart />
                    

            </div>
        
        <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
                   
                   <TopEvent />
                   <CategoryChart />

            </div>
            
        </div>
        
      </main>
    </div>
  );
}
