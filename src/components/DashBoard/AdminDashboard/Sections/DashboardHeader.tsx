import { HambugerIcon } from "@/assets/icons";
import NotificationBellDropdown from "@/components/Notifications/NotificationBellDropdown";

interface DashboardHeaderProps {
      onMenuClick?: () => void;
      title?: string;
}

export default function DashboardHeader({ onMenuClick, title = "DashBoard" }: DashboardHeaderProps) {
      return (
            <header className="w-full h-24 bg-neutral-1000 flex items-center justify-between px-4 md:px-8 border-b border-neutral-900">
                  <div className="flex items-center gap-4">
                        <button
                              type="button"
                              className="lg:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                              onClick={onMenuClick}
                              aria-label="Open sidebar menu"
                        >
                              <HambugerIcon />
                        </button>
                        <h1 className="text-xl md:text-2xl font-bold font-jakarta text-white tracking-tight">{title}</h1>
                  </div>

                  <div className="flex items-center gap-3">
                        <NotificationBellDropdown />
                  </div>
            </header>
      );
}
