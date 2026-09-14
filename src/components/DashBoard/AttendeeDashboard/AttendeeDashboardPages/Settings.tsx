import { useState } from "react";
import Profile from "@/components/DashBoard/AttendeeDashboard/Sections/SettingsSections/Profile";
import Notifications from "@/components/DashBoard/AttendeeDashboard/Sections/SettingsSections/Notifications";
import Security from "@/components/DashBoard/AttendeeDashboard/Sections/SettingsSections/Security";
import { Button } from "@/components/ui/button";

type TabKey = "profile" | "notifications" | "security";

const TAB_ITEMS: { key: TabKey; label: string }[] = [
      { key: "profile", label: "Profile Info" },
      { key: "notifications", label: "Notifications" },
      { key: "security", label: "Security" },
];

const Settings = () => {
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
            <div className="min-w-0 bg-neutral-925 pb-10">
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
      );
};

export default Settings;
