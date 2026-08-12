import { useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import DashboardHeader from "@/components/DashBoard/DashboardHeader";

import {
  RevenueIcon,
  TicketIcon,
  EventIcon,
  AttendeeIcon,
} from "@/assets/icons";
import { Button } from "@/components/ui/button";
import RevenueChart from "@/components/DashBoard/RevenueChart";
import CategoryChart from "@/components/DashBoard/CategoryChart";
import RecentEvents from "@/components/DashBoard/RecentEvents";
import RecentTransactions from "@/components/DashBoard/RecentTransactions";

const stats = [
  {
    title: "Total Revenue",
    value: "₦4,820,000",
    change: "30% ↑",
    trend: "up",
    icon: RevenueIcon,
    iconBg: "bg-purple-500/24",
    iconColor: "text-purple-400",
  },
  {
    title: "Tickets Sold",
    value: "10",
    change: "5% ↓",
    trend: "down",
    icon: TicketIcon,
    iconBg: "bg-orange-500/24",
    iconColor: "text-orange-500",
  },
  {
    title: "Active Events",
    value: "2",
    change: "3% ↑",
    trend: "up",
    icon: EventIcon,
    iconBg: "bg-green-500/24",
    iconColor: "text-green-400",
  },
  {
    title: "Total Attendees",
    value: "1,000",
    change: "10% ↑",
    trend: "up",
    icon: AttendeeIcon,
    iconBg: "bg-yellow-500/24",
    iconColor: "text-yellow-400",
  },
];

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex ">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 bg-neutral-900">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

        {isSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />

            <div className="fixed left-0 top-0 h-full  sm:w-64 max-w-xs z-50 lg:hidden overflow-y-auto">
              <div className="p-4 bg-neutral-1000 min-h-full">
                <div className="flex items-center justify-end mb-6">
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 rounded-md hover:bg-white/10 text-white"
                  >
                    
                  </button>
                </div>

                <Sidebar />
              </div>
            </div>
          </>
        )}

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <p className="text-white text-[24px] font-medium">
              Welcome back, Michael. Here's what's happening.
            </p>

            <Button variant="yellow" className=" md:w-auto w-1/2">
              + Create New Event
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4  gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-neutral-1000  rounded-xl p-6">
                  <div className="flex items-center  gap-2 mb-6">
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
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 items-stretch">
            <RevenueChart />
            <CategoryChart />
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <RecentEvents />
            <RecentTransactions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
