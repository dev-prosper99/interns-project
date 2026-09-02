import Sidebar from "@/components/layouts/Sidebar";
import StatsCard from "@/components/DashBoard/AdminDashboard/overview/DashboardStatCard";
import  { dashboardStats } from "@/components/DashBoard/AdminDashboard/overview/dashboardStats";
import RevenueChart from "@/components/DashBoard/AdminDashboard/RevenueChart";

export default function Analytics() {
  return (
    <div className="flex min-h-screen bg-neutral-950">
      <Sidebar />

      <main className="flex-1 ">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {dashboardStats.map((stat) => (
            <StatsCard key={stat.title} stat={stat} />
          ))}
        </div>

        <div className="mt-6">
          <RevenueChart />
        </div>
      </main>
    </div>
  );
}