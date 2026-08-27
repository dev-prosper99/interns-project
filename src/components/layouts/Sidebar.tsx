import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DashboardIcon,
  EventIcon,
  TicketIcon,
  AnalyticsIcon,
  TransactionIcon,
  AttendeeIcon,
  SettingsIcon,
  LogoutIcon,
  DownarrowIcon
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
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const navigate = useNavigate();

  const displayName =
    (localStorage.getItem("fullName") ||
      localStorage.getItem("firstName") ||
      "User")
      .trim()
      .replace(/\s+/g, " ") || "User";

  const userEmail =
    (localStorage.getItem("email") || "your@email.com").trim() ||
    "your@email.com";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("firstName");
    localStorage.removeItem("fullName");
    localStorage.removeItem("email");
    setShowLogoutMenu(false);
    navigate("/login");
  };

  return (
    <aside className="h-screen w-56 bg-neutral-1000 flex flex-col px-3 py-5 sticky top-0">
      <div className="flex-1">
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
                      ? " text-white bg-purple-500 font-bold"
                      : "text-neutral-400 hover:text-white"
                  }`}
              >
                <Icon
                  color={isActive ? "white" : "#A2A4A9"}
                  style={{ fontWeight: isActive ? 700 : 400 }}
                />

                {label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto pt-4 border-t border-white/5 relative">
        <button
          type="button"
          onClick={() => setShowLogoutMenu((prev) => !prev)}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 cursor-pointer text-left"
        >
          <div className="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center text-[10px] font-semibold text-white shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate leading-tight">
              {displayName}
            </p>
            <p className="text-neutral-500 text-[11px] truncate leading-tight mt-0.5">
              {userEmail}
            </p>
          </div>
          <span
            className={`text-neutral-300 text-lg leading-none transition-transform duration-200 ${
              showLogoutMenu ? "rotate-180" : "rotate-0"
            }`}
          >
            <DownarrowIcon />
          </span>
        </button>

        {showLogoutMenu && (
          <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl bg-neutral-800 overflow-hidden shadow-lg">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-white/5"
            >
              <span className="text-base"><LogoutIcon /></span>
              Log Out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
