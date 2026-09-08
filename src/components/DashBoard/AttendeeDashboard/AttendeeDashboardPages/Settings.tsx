import { useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import DashboardHeader from "@/components/Dashboard/AttendeeDashboard/DashboardHeader";
import Profile from "@/components/Dashboard/AttendeeDashboard/Sections/SettingsSections/Profile";
import Notifications from "@/components/Dashboard/AttendeeDashboard/Sections/SettingsSections/Notifications";
import Security from "@/components/Dashboard/AttendeeDashboard/Sections/SettingsSections/Security";
import { DashboardIcon, EventIcon, SettingsIcon, TicketIcon } from "@/assets/icons";
import { HeartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type TabKey = "profile" | "notifications" | "security";

const TAB_ITEMS: { key: TabKey; label: string }[] = [
      { key: "profile", label: "Profile Info" },
      { key: "notifications", label: "Notifications" },
      { key: "security", label: "Security" },
];

const attendeeSidebarItems = [
      { label: "Dashboard", path: "/dashboard", icon: DashboardIcon },
      { label: "Discover Events", path: "/discover-events", icon: EventIcon },
      { label: "My Tickets", path: "/my-tickets", icon: TicketIcon },
      { label: "Saved Events", path: "/saved-events", icon: HeartIcon },
      { label: "Settings", path: "/my-settings", icon: SettingsIcon },
];

const Settings = () => {
      const [isSidebarOpen, setIsSidebarOpen] = useState(false);
      const [activeTab, setActiveTab] = useState<TabKey>("profile");

      const renderTabContent = () => {
            switch (activeTab) {
                  case "notifications":
                        return <Notifications />;
                  case "security":
                        return <Security />;
                  case "profile":
                  default:
                        return <Profile />;
            }
      };

      return (
            <div className="flex min-h-screen">
                  <div className="hidden lg:block">
                        <Sidebar items={attendeeSidebarItems} />
                  </div>

                  <div className="min-w-0 flex-1 bg-neutral-925 pb-10">
                        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} title="Settings" />

                        {isSidebarOpen && (
                              <>
                                    <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
                                    <div className="fixed left-0 top-0 z-50 h-full max-w-xs overflow-y-auto sm:w-64 lg:hidden">
                                          <div className="min-h-full bg-neutral-1000 p-4">
                                                <div className="mb-6 flex items-center justify-end">
                                                      <button
                                                            onClick={() => setIsSidebarOpen(false)}
                                                            aria-label="Close menu"
                                                            className="rounded-md p-2 text-white hover:bg-white/10"
                                                      >
                                                            ×
                                                      </button>
                                                </div>
                                                <Sidebar items={attendeeSidebarItems} />
                                          </div>
                                    </div>
                              </>
                        )}

                        <main className="mx-auto w-full max-w-7xl px-4 py-5">
                              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <p className="text-lg font-medium font-jakarta text-white sm:text-xl">Manage your account and preferences</p>
                              </div>

                              <div className="mt-6 mb-3 flex flex-wrap gap-2">
                                    {TAB_ITEMS.map((tab) => {
                                          const isActiveTab = activeTab === tab.key;

                                          return (
                                                <Button
                                                      key={tab.key}
                                                      type="button"
                                                      variant={isActiveTab ? "primary" : "neutral"}
                                                      size="sm"
                                                      onClick={() => setActiveTab(tab.key)}
                                                      className={`border text-white ${isActiveTab ? " bg-purple-600/24 text-purple-600 border-purple-600/24" : "bg-none border-neutral-600 "}`}
                                                >
                                                      {tab.label}
                                                </Button>
                                          );
                                    })}
                              </div>

                              <div className="mt-5 w-full font-poppins">{renderTabContent()}</div>
                        </main>
                  </div>
            </div>
      );
};

export default Settings;
