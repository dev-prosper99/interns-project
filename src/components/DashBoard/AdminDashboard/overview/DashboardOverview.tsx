import { Button } from "@/components/ui/button";
import RevenueChart from "@/components/DashBoard/AdminDashboard/RevenueChart";
import CategoryChart from "@/components/DashBoard/AdminDashboard/CategoryChart";
import RecentEvents from "@/components/DashBoard/AdminDashboard/RecentEvents";
import RecentTransactions from "@/components/DashBoard/AdminDashboard/RecentTransactions";

import DashboardStatCard from "./DashboardStatCard";
import { dashboardStats } from "./dashboardStats";

const DashboardOverview = () => {
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <p className="text-white text-[24px] font-medium">
          Welcome back, Michael. Here's what's happening.
        </p>

        <Button variant="yellow" className="md:w-auto w-1/2">
          + Create New Event
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <DashboardStatCard key={stat.title} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 items-stretch">
        <RevenueChart />
        <CategoryChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 items-stretch">
        <RecentEvents />
        <RecentTransactions />
      </div>
    </div>
  );
};

export default DashboardOverview;