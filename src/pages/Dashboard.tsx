import { useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import DashboardHeader from "@/components/DashBoard/AdminDashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import DashboardStatCard from "@/components/DashBoard/AdminDashboard/overview/DashboardStatCard";
import { dashboardStats } from "@/components/DashBoard/AdminDashboard/overview/dashboardStats";
import RevenueChart from "@/components/DashBoard/AdminDashboard/RevenueChart";
import CategoryChart from "@/components/DashBoard/AdminDashboard/CategoryChart";
import RecentEvents from "@/components/DashBoard/AdminDashboard/RecentEvents";
import RecentTransactions from "@/components/DashBoard/AdminDashboard/RecentTransactions";
import CreateEventModal from "@/components/DashBoard/AdminDashboard/CreateEvent/CreateEventModal";
 
const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false); // NEW
 
  const firstName = (localStorage.getItem("firstName") || "there")
    .trim()
    .replace(/\s+/g, " ") || "there";
 
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
            <div className="fixed left-0 top-0 h-full sm:w-64 max-w-xs z-50 lg:hidden overflow-y-auto">
              <div className="p-4 bg-neutral-1000 min-h-full">
                <div className="flex items-center justify-end mb-6">
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Close menu"
                    className="p-2 rounded-md hover:bg-white/10 text-white"
                  >
                    ×
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
              Welcome back, {firstName}. Here's what's happening.
            </p>
 
            <Button
              variant="yellow"
              className="md:w-auto w-1/2"
              onClick={() => setIsCreateEventOpen(true)} // NEW
            >
              + Create New Event
            </Button>
          </div>
 
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {dashboardStats.map((stat, idx) => (
              <DashboardStatCard key={idx} stat={stat} />
            ))}
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
 
      {/* NEW: overlay + centered modal */}
      {isCreateEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <CreateEventModal
            isOpen={isCreateEventOpen}
            onClose={() => setIsCreateEventOpen(false)}
          />
        </div>
      )}
    </div>
  );
};
 
export default Dashboard;
 