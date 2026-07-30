import { useState } from "react";
import {
  DashboardIcon,
  EventIcon,
  TicketIcon,
  AnalyticsIcon,
  TransactionIcon,
  AttendeeIcon,
  SettingsIcon,
} from "@/assets/icons";
import logo from "@/assets/images/logo.png";

const navItems = [
  { label: "Dashboard", icon: DashboardIcon },
  { label: "Events", icon: EventIcon },
  { label: "Tickets", icon: TicketIcon },
  { label: "Analytics", icon: AnalyticsIcon },
  { label: "Transactions", icon: TransactionIcon },
  { label: "Attendees", icon: AttendeeIcon },
  { label: "Settings", icon: SettingsIcon },
];

export default function Sidebar() {
  const [active, setActive] = useState<string>("Dashboard");

  return (
    <div className="h-screen w-56 bg-[#0e0e11] flex flex-col justify-between px-3 py-5">
    
      <div>
        <div className="flex items-center gap-2 px-2 mb-8">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
        </div>

    
        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, icon: Icon }) => {
            const isActive = active === label;
            return (
              <button
                key={label}
                onClick={() => setActive(label)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left
                  ${
                    isActive
                      ? " text-white bg-purple-500"
                      : "text-neutral-400  hover:text-white"
                  }`}
              >
                <Icon strokeWidth={2} />
                {label}
              </button>
            );
          })}
        </nav>
      </div>

    
      <div className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/5 cursor-pointer">
        <div className="w-8 h-8 rounded-full  flex items-center justify-center text-xs font-semibold text-white shrink-0">
          ME
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">
            Michael Events
          </p>
          <p className="text-neutral-500 text-xs truncate">
            michaelevents@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}
