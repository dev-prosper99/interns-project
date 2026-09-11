import { useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import DashboardHeader from "@/components/DashBoard/AdminDashboard/Sections/DashboardHeader";
import { Button } from "@/components/ui/button";
import DashboardStatCard from "@/components/DashBoard/AdminDashboard/overview/DashboardStatCard";
import { useDashboardStats } from "@/components/DashBoard/AdminDashboard/overview/dashboardStats";
import RevenueChart from "@/components/DashBoard/AdminDashboard/Sections/RevenueChart";
import CategoryChart from "@/components/DashBoard/AdminDashboard/Sections/CategoryChart";
import RecentEvents from "@/components/DashBoard/AdminDashboard/Sections/RecentEvents";
import RecentTransactions from "@/components/DashBoard/AdminDashboard/Sections/RecentTransactions";
import CreateEventModal from "@/components/DashBoard/AdminDashboard/CreateEvent/CreateEventModal";

const AdminDashboard = () => {
      const [isSidebarOpen, setIsSidebarOpen] = useState(false);
      const [isCreateEventOpen, setIsCreateEventOpen] = useState(false); // NEW

      const firstName = (localStorage.getItem("firstName") || "there").trim().replace(/\s+/g, " ") || "there";

      return (
            <div className="flex ">
                  <div className="hidden lg:block">
                        <Sidebar />
                  </div>

                  <div className="flex-1 bg-neutral-900">
                        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

                        {isSidebarOpen && (
                              <>
                                    <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
                                    <div className="fixed inset-y-0 left-0 z-50 w-[min(21rem,88vw)] lg:hidden">
                                          <Sidebar onClose={() => setIsSidebarOpen(false)} />
                                    </div>
                              </>
                        )}

                        <div className="p-6">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                    <p className="text-white text-[24px] font-medium">Welcome back, {firstName}. Here's what's happening.</p>

                                    <Button
                                          variant="yellow"
                                          className="md:w-auto w-1/2"
                                          onClick={() => setIsCreateEventOpen(true)} // NEW
                                    >
                                          + Create New Event
                                    </Button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                                    {useDashboardStats().map((stat, idx) => (
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
                              <CreateEventModal isOpen={isCreateEventOpen} onClose={() => setIsCreateEventOpen(false)} />
                        </div>
                  )}
            </div>
      );
};

export default AdminDashboard;
