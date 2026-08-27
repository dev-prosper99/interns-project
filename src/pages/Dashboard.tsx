import { useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import DashboardHeader from "@/components/DashBoard/AdminDashboard/DashboardHeader";
import DashboardOverview from "@/components/DashBoard/AdminDashboard/overview/DashboardOverview";

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

        <DashboardOverview />
      </div>
    </div>
  );
};

export default Dashboard;
